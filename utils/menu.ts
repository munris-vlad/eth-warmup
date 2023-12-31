import inquirer from "inquirer"

export const entryPoint = async () => {
    const questions = [
        {
            name: "choice",
            type: "list",
            message: "Действие:",
            choices: [
                {
                    name: "Custom modules",
                    value: "custom",
                },
                {
                    name: "Base bridge",
                    value: "base_bridge",
                },
                {
                    name: "Zora bridge",
                    value: "zora_bridge",
                },
                {
                    name: "Zk bridge",
                    value: "zk_bridge",
                },
                {
                    name: "Starknet bridge",
                    value: "starknet_bridge",
                },
                {
                    name: "Transfer",
                    value: "transfer",
                },
                {
                    name: "Bungee",
                    value: "bungee",
                },
                {
                    name: "Mintfun",
                    value: "mintfun",
                },
            ],
            loop: false,
        },
    ]

    const answers = await inquirer.prompt(questions)
    return answers.choice
}