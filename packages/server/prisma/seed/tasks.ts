/*
Seed the tasks from the old database
*/

import { PrismaClient } from "@prisma/client";
import admin from 'firebase-admin';

export async function seedTasks(prisma: PrismaClient, app: admin.app.App) {
    const db = app.firestore();

    const tasks: OldTask[] = []

    await db.collection('tasks').get().then((snapshot) => {
        snapshot.forEach((doc) => tasks.push({
            id: doc.id,
            ...doc.data()
        } as OldTask));
    });

    for (const task of tasks) {
        // Create the task
        await prisma.task.upsert({
            where: {
                id: task.id
            },
            update: {
                name: task.name,
                color: task.color,
                priority: task.ranking,
            },
            create: {
                id: task.id,
                name: task.name,
                color: task.color,
                priority: task.ranking,
            }
        });

        const fieldIdMap: { [key: string]: string } = {};
        // Create the task form fields
        for (const field of task.form.fields) {
            const result = await prisma.taskFormFields.upsert({
                where: {
                    taskId_slug: {
                        taskId: task.id,
                        slug: field.id
                    }
                },
                update: {
                    type: field.input.type == "boolean" ? "BOOLEAN" : "NUMBER",
                    label: field.label,
                    unit: field.input.units,
                    min: field.input.range?.min,
                    max: field.input.range?.max,
                    task: {
                        connect: {
                            id: task.id
                        }
                    }
                },
                create: {
                    slug: field.id,
                    type: field.input.type == "boolean" ? "BOOLEAN" : "NUMBER",
                    label: field.label,
                    unit: field.input.units,
                    min: field.input.range?.min,
                    max: field.input.range?.max,
                    task: {
                        connect: {
                            id: task.id
                        }
                    }
                }
            });

            fieldIdMap[`${task.id}-${field.id}`] = result.id;
        }

        // Create the task instructions
        await prisma.taskInstructions.upsert({
            where: {
                taskId: task.id
            },
            update: {
                text: task.instructions.content,
                task: {
                    connect: {
                        id: task.id
                    }
                }
            },
            create: {
                text: task.instructions.content,
                task: {
                    connect: {
                        id: task.id
                    }
                }
            }
        });

        // Create the task setup
        await prisma.taskSetup.upsert({
            where: {
                taskId: task.id
            },
            update: {
                text: task.setup.content,
                task: {
                    connect: {
                        id: task.id
                    }
                }
            },
            create: {
                id: task.id,
                text: task.setup.content,
                task: {
                    connect: {
                        id: task.id
                    }
                }
            }
        });

        // Add the setup attachments
        for (const attachment of task.setup.attachments) {
            await prisma.taskSetupAttachments.upsert({
                where: {
                    id: attachment,
                    url: attachment,
                },
                update: {
                    url: attachment,
                    taskSetup: {
                        connect: {
                            id: task.id
                        }
                    }
                },
                create: {
                    id: attachment,
                    url: attachment,
                    taskSetup: {
                        connect: {
                            id: task.id
                        }
                    }
                }
            });
        }

        // Add the task stars
        for (const [i, description] of task.stars.entries()) {
            await prisma.taskStarDescriptions.upsert({
                where: {
                    taskId_starLevel: {
                        taskId: task.id,
                        starLevel: i + 1
                    }
                },
                update: {
                    text: description,
                    task: {
                        connect: {
                            id: task.id
                        }
                    }
                },
                create: {
                    text: description,
                    starLevel: i + 1,
                    task: {
                        connect: {
                            id: task.id
                        }
                    }
                }
            });
        }


        // Add the task scoring criteria
        for (const rubric of task.scoring) {
            const scoring = await prisma.taskScoring.upsert({
                where: {
                    scoring_taskId_starLevel: {
                        taskId: task.id,
                        starLevel: rubric.id
                    }
                },
                update: {
                    consecutiveAttempts: rubric.criteria.consecutive,
                    totalAttempts: rubric.criteria.total,
                    task: {
                        connect: {
                            id: task.id
                        }
                    }
                },
                create: {
                    consecutiveAttempts: rubric.criteria.consecutive,
                    totalAttempts: rubric.criteria.total,
                    starLevel: rubric.id,
                    task: {
                        connect: {
                            id: task.id
                        }
                    }
                }
            });

            // Add the task scoring fields
            for (const field of rubric.fields) {
                const passingBool = String(field.passing) == "true" || String(field.passing) == "false" ? field.passing : undefined;
                const passingInt = !(String(field.passing) == "true" || String(field.passing) == "false") ? field.passing : undefined;

                await prisma.taskScoringFields.upsert({
                    where: {
                        taskScoringId_formFieldId: {
                            taskScoringId: scoring.id,
                            formFieldId: fieldIdMap[`${task.id}-${field.id}`]
                        }
                    },
                    update: {
                        failMessage: field.failMessage,
                        passingBool: passingBool as any,
                        passingInt: passingInt as any,
                        taskScoring: {
                            connect: {
                                id: scoring.id
                            }
                        }
                    },
                    create: {
                        failMessage: field.failMessage,
                        passingBool: passingBool as any,
                        passingInt: passingInt as any,
                        taskScoring: {
                            connect: {
                                id: scoring.id
                            }
                        },
                        formField: {
                            connect: {
                                id: fieldIdMap[`${task.id}-${field.id}`]
                            }
                        }
                    }
                });
            }

            // Add the task times
            await prisma.taskScoringTime.upsert({
                where: {
                    taskScoringId: scoring.id
                },
                update: {
                    maxTime: rubric.time.max,
                    passingTime: rubric.time.passing,
                    taskScoring: {
                        connect: {
                            id: scoring.id
                        }
                    }
                },
                create: {
                    maxTime: rubric.time.max,
                    passingTime: rubric.time.passing,
                    taskScoring: {
                        connect: {
                            id: scoring.id
                        }
                    }
                }
            });
        }
    }
}

interface OldTask {
    id: string,
    name: string,
    color: string,
    fastestTime: number,
    form: {
        fields: {
            id: string,
            label: string,
            input: {
                type: "boolean" | "number",
                units?: string,
                range?: {
                    min: number,
                    max: number
                }
            }
        }[],
    },
    instructions: {
        content: string,
    },
    ranking: number,
    scoring: {
        criteria: {
            consecutive: number,
            total: number
        },
        fields: {
            id: string,
            failMessage: string,
            passing: number | boolean,
        }[],
        time: {
            max: number,
            passing: number,
        }
        id: number,
    }[],
    setup: {
        attachments: string[],
        content: string,
    },
    stars: string[],
    video: string,
}