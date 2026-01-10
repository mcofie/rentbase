export default defineAppConfig({
    ui: {
        primary: 'primary',
        gray: 'stone',
        button: {
            defaultVariants: {
                size: 'xl',
                variant: 'solid',
            },
            slots: {
                base: 'rounded-full px-8 py-4',
            }
        },
        input: {
            defaultVariants: {
                size: 'xl',
                variant: 'outline',
                color: 'gray',
            },
            slots: {
                base: 'rounded-2xl',
            }
        },
        card: {
            slots: {
                root: 'rounded-3xl ring-1 ring-stone-200 dark:ring-white/10 shadow-sm hover:shadow-xl transition-shadow duration-300',
            }
        },
        modal: {
            slots: {
                overlay: 'bg-purple-950/20 backdrop-blur-md',
            }
        }
    }
})
