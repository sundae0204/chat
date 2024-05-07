const db_config_version = 3;

const db_config_define = [
    {
        name: 'global',
        type: 'object',
        created: 2
    }, {
        name: 'global.language',
        type: 'string',
        default: 'zho-Hans',
        created: 2,
        attribute: {
            datalist: []
        }
    }, {
        name: 'global.theme',
        type: 'string',
        default: 'vanilla',
        created: 3,
        attribute: {
            datalist: []
        }
    }, {
        name: 'global.theme_script_enable',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'global.color_scheme',
        type: 'string',
        default: 'vanilla',
        created: 3,
        attribute: {
            datalist: []
        }
    },
    


    {
        name: 'echo',
        type: 'object',
        created: 1
    }, {
        name: 'echo.print_speed',
        type: 'number',
        default: 30,
        created: 1,
        attribute: {
            min: 4
        }
    }, {
        name: 'echo.html_format_enable',
        type: 'boolean',
        default: true,
        created: 3
    },
    


    {
        name: 'echolive',
        type: 'object',
        created: 1
    }, {
        name: 'echolive.live_theme',
        type: 'string',
        default: '',
        created: 1
    }, {
        name: 'echolive.live_theme_script_enable',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'echolive.broadcast_enable',
        type: 'boolean',
        default: true,
        created: 1
    }, {
        name: 'echolive.broadcast_channel',
        type: 'string',
        default: 'sheep-realms:echolive',
        created: 1,
        attribute: {
            datalist: [
                {
                    value: 'sheep-realms:echolive'
                }
            ]
        }
    }, {
        name: 'echolive.websocket_enable',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'echolive.websocket_url',
        type: 'string',
        default: 'ws://127.0.0.1:3000',
        created: 1
    }, {
        name: 'echolive.websocket_reconnect_limit',
        type: 'number',
        default: 5,
        created: 2,
        attribute: {
            min: 0
        }
    }, {
        name: 'echolive.experimental_api_enable',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'echolive.messages_polling_enable',
        type: 'boolean',
        default: true,
        created: 1
    }, {
        name: 'echolive.messages_polling_tick',
        type: 'number',
        default: 250,
        created: 1,
        attribute: {
            min: 4
        }
    }, {
        name: 'echolive.sleep_enable',
        type: 'boolean',
        default: true,
        created: 1
    }, {
        name: 'echolive.sleep_during_printing_stop_print',
        type: 'boolean',
        default: true,
        created: 2
    }, {
        name: 'echolive.print_audio_enable',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'echolive.print_audio_name',
        type: 'string',
        default: 'typewriter_loop',
        created: 1,
        attribute: {
            datalist: []
        }
    }, {
        name: 'echolive.print_audio_volume',
        type: 'number',
        default: 0.5,
        created: 1,
        attribute: {
            max: 1,
            min: 0,
            step: 0.1
        }
    }, {
        name: 'echolive.print_audio_rate',
        type: 'number',
        default: 1,
        created: 1,
        attribute: {
            min: 0,
            step: 0.25
        }
    }, {
        name: 'echolive.next_audio_enable',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'echolive.next_audio_name',
        type: 'string',
        default: 'enter',
        created: 1,
        attribute: {
            datalist: []
        }
    }, {
        name: 'echolive.next_audio_volume',
        type: 'number',
        default: 0.5,
        created: 1,
        attribute: {
            max: 1,
            min: 0,
            step: 0.1
        }
    }, {
        name: 'echolive.next_audio_rate',
        type: 'number',
        default: 1,
        created: 1,
        attribute: {
            min: 0,
            step: 0.25
        }
    }, {
        name: 'echolive.next_effect_name',
        type: 'string',
        default: 'none',
        created: -1
    }, {
        name: 'echolive.next_effect_duration',
        type: 'number',
        default: 0,
        created: -1
    }, {
        name: 'echolive.print_effect_name',
        type: 'string',
        default: 'none',
        created: -1
    }, {
        name: 'echolive.print_effect_duration',
        type: 'number',
        default: 0,
        created: -1
    }, {
        name: 'echolive.print_start_effect_name',
        type: 'string',
        default: 'none',
        created: -1
    }, {
        name: 'echolive.print_start_effect_duration',
        type: 'number',
        default: 0,
        created: -1
    }, {
        name: 'echolive.print_end_effect_name',
        type: 'string',
        default: 'none',
        created: -1
    }, {
        name: 'echolive.print_end_effect_duration',
        type: 'number',
        default: 0,
        created: -1
    },
    


    {
        name: 'editor',
        type: 'object',
        created: 1
    }, {
        name: 'editor.tabpage_config_enable',
        type: 'boolean',
        default: true,
        created: 1
    }, {
        name: 'editor.tabpage_output_enable',
        type: 'boolean',
        default: true,
        created: 1
    }, {
        name: 'editor.client_state_panel_enable',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'editor.username_init',
        type: 'string',
        default: '',
        created: 1
    }, {
        name: 'editor.output_before',
        type: 'string',
        default: 'echolive.send(',
        created: 1
    }, {
        name: 'editor.ontput_before_enable',
        type: 'boolean.bit',
        default: 1,
        created: 1
    }, {
        name: 'editor.output_after',
        type: 'string',
        default: ');',
        created: 1
    }, {
        name: 'editor.ontput_after_enable',
        type: 'boolean.bit',
        default: 1,
        created: 1
    }, {
        name: 'editor.history_resend_bubble',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'editor.history_maximum',
        type: 'number',
        default: 128,
        created: 1,
        attribute: {
            min: -1
        }
    }, {
        name: 'editor.log_line_maximum',
        type: 'number',
        default: 512,
        created: 1,
        attribute: {
            min: -1
        }
    }, {
        name: 'editor.palette',
        type: 'special.all_or_array_string',
        default: 'all',
        created: 1
    }, {
        name: 'editor.palette_color_contrast_enable',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'editor.palette_color_contrast_background_color',
        type: 'string',
        default: '#ffffff',
        created: 1
    }, {
        name: 'editor.palette_color_contrast_threshold',
        type: 'number',
        default: 3.8,
        created: 1,
        attribute: {
            max: 21,
            min: 0,
            step: 0.1
        }
    },



    {
        name: 'history',
        type: 'object',
        created: 2
    }, {
        name: 'history.history_theme',
        type: 'string',
        default: '',
        created: 3
    }, {
        name: 'history.history_theme_script_enable',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'history.message_list_reverse',
        type: 'boolean',
        default: false,
        created: 2
    }, {
        name: 'history.message_item_reverse',
        type: 'boolean',
        default: false,
        created: 2
    }, {
        name: 'history.display_username',
        type: 'boolean',
        default: true,
        created: 2
    }, {
        name: 'history.display_time',
        type: 'boolean',
        default: true,
        created: 2
    }, {
        name: 'history.remove_continuous_duplicate',
        type: 'boolean',
        default: true,
        created: 2
    }, {
        name: 'history.latest_message_hide',
        type: 'boolean',
        default: true,
        created: 2
    },



    {
        name: 'accessible',
        type: 'object',
        created: 1
    }, {
        name: 'accessible.high_contrast',
        type: 'boolean',
        default: false,
        created: 1
    }, {
        name: 'accessible.high_contrast_outline_color',
        type: 'string',
        default: '#00E9FF',
        created: 2
    }, {
        name: 'accessible.high_contrast_outline_size',
        type: 'string',
        default: '2px',
        created: 2
    }, {
        name: 'accessible.high_contrast_outline_style',
        type: 'string',
        default: 'solid',
        created: 2,
        attribute: {
            datalist: [
                {
                    value: 'solid'
                }, {
                    value: 'dotted'
                }, {
                    value: 'dashed'
                }, {
                    value: 'double'
                }
            ]
        }
    }, {
        name: 'accessible.drotanopia_and_deuteranopia',
        type: 'boolean',
        default: false,
        created: 1
    },



    {
        name: 'advanced',
        type: 'object',
        created: 1
    }, {
        name: 'advanced.broadcast',
        type: 'object',
        created: 1
    }, {
        name: 'advanced.broadcast.allow_name_duplicate',
        type: 'boolean',
        default: false,
        created: 2
    }, {
        name: 'advanced.editor',
        type: 'object',
        created: 1
    }, {
        name: 'advanced.editor.history_minimum_breaker_threshold',
        type: 'number',
        default: 128,
        created: 1,
        attribute: {
            min: -1
        }
    },



    {
        name: 'selector',
        type: 'object',
        created: -1
    }, {
        name: 'character',
        type: 'object',
        created: -1
    }
];