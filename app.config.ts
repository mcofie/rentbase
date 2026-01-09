export default defineAppConfig({
    ui: {
        primary: 'uni',
        gray: 'zinc',
        button: {
            default: {
                size: 'lg',
                radius: 'rounded-full',
            }
        },
        input: {
            default: {
                size: 'lg',
                radius: 'rounded-2xl',
            }
        },
        card: {
            default: {
                radius: 'rounded-3xl',
            }
        },
        modal: {
            default: {
                overlay: {
                    background: 'bg-gray-900/40 backdrop-blur-sm'
                }
            }
        }
    }
})
