export default defineAppConfig({
    ui: {
        primary: 'stone',
        gray: 'stone',
        button: {
            defaultVariants: {
                size: 'lg',
                variant: 'solid',
                color: 'black'
            },
            slots: {
                base: 'rounded-lg font-medium transition-colors',
            }
        },
        input: {
            defaultVariants: {
                size: 'lg',
                variant: 'outline',
                color: 'gray',
            },
            slots: {
                base: 'rounded-lg',
            }
        },
        card: {
            slots: {
                root: 'rounded-lg border border-stone-200 dark:border-stone-800 shadow-sm transition-all duration-200',
                header: 'p-4 sm:px-6',
                body: 'p-4 sm:px-6',
                footer: 'p-4 sm:px-6',
            }
        },
        modal: {
            slots: {
                overlay: 'bg-stone-900/10 backdrop-blur-sm',
                base: 'rounded-xl shadow-xl'
            }
        },
        select: {
            defaultVariants: {
                size: 'lg',
            },
            slots: {
                base: 'rounded-lg'
            }
        }
    }
})
