import chalk from 'chalk'

export const point = {
    step(msg: string) {
        console.log(chalk.blue('#', msg))
    },
    message(msg: string): void {
        console.log(chalk.green('>', msg))
    },
    warn(msg: string): void {
        console.log(chalk.yellow('!', msg))
    },
    error(msg: string): void {
        console.log(chalk.red('✖', msg))
    },
    success(msg: string) {
        console.log(chalk.green('√', msg))
    },
    query(msg: string) {
        console.log(chalk.yellow('?', msg))
    }
}
