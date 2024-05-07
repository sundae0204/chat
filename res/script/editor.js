// 警告：这是一坨屎山

// 为了防止再出现逆天的建立在bug上运行的程序加入了严格模式
"use strict";

let textList = [
    {text: ''}
];

checkboxEvent = {
    "ptext-chk-use-formatting-code": ptextChkUseFormattingCodeChange
};

let history = [];
let historyMinimum = 0;
let historyClearConfirm = false;

let hasError = false;

let logScrollButInvisible = false;

setDefaultValue('#config-output-before', config.editor.output_before);
setDefaultValue('#config-output-after', config.editor.output_after);
$('#ptext-character, #rtext-character').val(config.editor.username_init);
setCheckboxDefaultValue('#config-output-use-before', config.editor.ontput_before_enable);
setCheckboxDefaultValue('#config-output-use-after', config.editor.ontput_after_enable);

$('#ptext-editor .editor-bottom-bar .length').text($t('editor.form.text_length', { n: 0 }));

$('.tabpage-panel[data-pageid="ptext"] .editor-controller').append(EditorForm.editorController('ptext-content'));

if (!config.editor.tabpage_config_enable) $('#tabpage-nav-config').addClass('hide');
if (!config.editor.tabpage_output_enable) $('#tabpage-nav-output').addClass('hide');

popupsCreate(Popups.palettePopups(echoLiveEditor.getPalettes()), '#popups-palette');
$('#popups-palette .palette-page').eq(0).removeClass('hide');
if (config.editor.palette_color_contrast_enable) $('#popups-palette').addClass('color-contrast-enable');
$('#popups-palette .popups-palette-color-contrast .diff-dashboard').css('--bg-color', config.editor.palette_color_contrast_background_color)
paletteColorContrastCheck('#000000');


let elb;

if (config.echo.print_speed != 30) {
    $('.echo-editor-form-input-tip').text($t('editor.form.description.print_speed_custom', { value: config.echo.print_speed }));
}

if (config.echolive.broadcast_enable) {
    $('#ptext-btn-submit').addClass('fh-ghost');
    $('#ptext-btn-send, #output-btn-send').removeClass('hide');
    $('#ptext-content, #output-content').attr('title', $t('editor.tip.hot_key_textarea_quick_send'));

    if (config.editor.client_state_panel_enable) {
        $('.echo-live-client-state').removeClass('hide');
    }

    // 纯文本 - 内容 - 快捷键
    $('#ptext-content').keydown(function(e) {
        // console.log(e.keyCode);
        if (e.ctrlKey) {
            if (e.keyCode == 13) {
                $('#ptext-btn-send').click();
                effectClick('#ptext-btn-send');
            } else if (e.keyCode == 83) {
                e.preventDefault();
            } else {
                let code = {
                    '66': 'bold',
                    '73': 'italic',
                    '85': 'underline',
                    '68': 'strikethrough',
                    '32': 'clear'
                };
                if (code[e.keyCode] == undefined) return;
                if (e.keyCode == 32 && !e.shiftKey) return;

                e.preventDefault();
                $(`#ptext-editor .editor-controller:not(.disabled) button[data-value="${code[e.keyCode]}"]`).click();
            }
        }
    })

    // 输出 - 内容 - 快捷键
    $('#output-content').keydown(function(e) {
        if (e.keyCode == 13 && e.ctrlKey) {
            $('#output-btn-send').click();
            effectClick('#output-btn-send');
        }
    })

    $('.echo-live-client-state-content').html(EditorClientState.statePanel([]));

    elb = new EchoLiveBroadcastServer(config.echolive.broadcast_channel, config);
    elb.on('clientsChange', clientsChange);
    elb.on('message', getMessage);
    elb.on('error', getError);
    elb.on('noClient', noClient);
    elb.on('nameDuplicate', nameDuplicate);

    checkNowDate();
    editorLogT('editor.log.broadcast_launch.done', { channel: config.echolive.broadcast_channel });
    editorLog('User Agent: ' + navigator.userAgent, 'dbug');
    if (navigator.userAgent.toLowerCase().search(/ obs\//) != -1) {
        editorLogT('editor.log.broadcast_launch.user_agent_check', {}, 'done');
    } else {
        editorLogT('editor.log.broadcast_launch.user_agent_error', {}, 'tips');
    }
} else {
    checkNowDate();
    editorLogT('editor.log.broadcast_launch.disable');
}


let logMsgMark = 0;

function editorLog(message = '', type = 'info') {
    $('#editor-log').append(`<div role="listitem" class="log-item log-type-${type}" ${type == 'dbug' ? 'aria-hidden="true"' : ''}><span class="time" aria-hidden="true">${getTime()}</span> <span class="type" aria-label="${ $t('editor.log.accessible.type.' + type) }">[${type.toUpperCase()}]</span> <span class="message" ${type == 'erro' || type == 'warn' ? ' role="alert"' : ''}>${message}</span></div>`);
    $('#editor-log').scrollTop(4503599627370496);

    if ($('#tabpage-nav-log[aria-selected="true"]').length <= 0) {
        logScrollButInvisible = true;
    }

    // 防止日志过多
    let $logitems = $('#editor-log .log-item');
    if (config.editor.log_line_maximum >= 0 && $logitems.length > config.editor.log_line_maximum) {
        $(`#editor-log .log-item:lt(${$logitems.length - config.editor.log_line_maximum})`).remove();
    }

    // 通知重要消息
    if ((type == 'warn' || type == 'erro') && $('#tabpage-nav-log').attr('aria-selected') == 'false') {
        logMsgMark++;
        $('#log-message-mark').text(logMsgMark);
        $('#log-message-mark').removeClass('hide');
    }
}

function editorLogT(key, data = {}, type = 'info') {
    let msg = $t(key, data);
    editorLog(msg, type);
}

$('#tabpage-nav-log').click(function() {
    if (logScrollButInvisible) {
        logScrollButInvisible = false;
        setTimeout(function() {
            $('#editor-log').scrollTop(4503599627370496);
        }, 20);
    }
});

$('#tabpage-nav-log').click(function() {
    logMsgMark = 0;
    $('#log-message-mark').addClass('hide');
});

function clientsChange(e) {
    $('.echo-live-client-state-content').html(EditorClientState.statePanel(e));
}

function getMessage(data) {
    switch (data.action) {
        case 'message_data':
            editorLogT('editor.log.broadcast.message_data_third');
            break;
            
        case 'hello':
            if (data.target == undefined || data.target == elb.uuid) {
                let helloMsg1 = data.data.hidden ? 'hello_hidden' : 'hello';
                editorLogT(
                    'editor.log.broadcast.' + helloMsg1,
                    {
                        client: $t('broadcast.client.type.' + data.from.type),
                        name: data.from.name
                    }
                );
            } else if (data.target == '@__server') {
                editorLogT(
                    'editor.log.broadcast.hello_to_server',
                    {
                        client: $t('broadcast.client.type.' + data.from.type),
                        name: data.from.name
                    }
                );
            }
            break;

        case 'ping':
            editorLogT(
                'editor.log.broadcast.ping_server',
                {
                    name: data.from.name
                }
            );
            break;

        case 'echo_next':
        case 'websocket_close':
            editorLogT('editor.log.broadcast.' + data.action);
            break;

        case 'close':
        case 'page_hidden':
        case 'page_visible':
            editorLogT(
                'editor.log.broadcast.' + data.action,
                {
                    client: $t('broadcast.client.type.' + data.from.type),
                    name: data.from.name
                }
            );
            break;

        case 'set_theme_style_url':
            editorLogT(
                'editor.log.broadcast.set_theme_style_url',
                {
                    url: data.data.url
                }
            );
            break;

        case 'set_theme':
            editorLogT(
                    'editor.log.broadcast.set_theme',
                    {
                        name: data.data.name
                    }
            );
            break;

        case 'error_unknow':
            editorLogT(
                'editor.log.error.unknown_error_in_client',
                {
                    client: $t('broadcast.client.type.' + data.from.type),
                    msg: data.data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/  /g, '&nbsp; ').replace(/\n/g, '<br>'),
                    source: EchoLiveTools.safeHTML(data.data.source),
                    line: data.data.line,
                    col: data.data.col,
                    name: data.from.name
                },
                'erro'
            );
            if (!hasError) {
                hasError = true;
                editorLogT('editor.log.tip.unknown_error', {}, 'tips');
            }
            break;

        default:
            break;
    }
}

function getError(data) {
    switch (data.data.name) {
        case 'websocket_error':
            if (data.data.tryReconnect) {
                editorLogT(
                    'editor.log.error.websocket_error',
                    {
                        client: $t('broadcast.client.type.live'),
                        url: data.data.url,
                        n: data.data.reconnectCount,
                        name: data.from.name
                    },
                    'erro'
                );
            } else {
                editorLogT(
                    'editor.log.error.websocket_error_retry_failed',
                    {
                        client: $t('broadcast.client.type.live'),
                        url: data.data.url,
                        name: data.from.name
                    },
                    'erro'
                );
            }
            break;

        case 'websocket_message_error':
            editorLogT(
                'editor.log.error.websocket_message_error',
                {
                    client: $t('broadcast.client.type.live'),
                    name: data.from.name
                },
                'erro'
            );
            break;
    
        default:
            break;
    }
}

function noClient() {
    editorLogT('editor.log.warn.no_client', {}, 'warn');
}

function nameDuplicate(name, uuid) {
    editorLogT('editor.log.error.name_duplicate', { name: name, uuid: uuid}, 'erro');
}


// 纯文本重置
$('#ptext-btn-clear').click(function() {
    $('#ptext-content').val('');
    // $('#ptext-ipt-print-speed').val('30');
    let $sel = $('.tabpage-panel[data-pageid="ptext"] input.reset');
    for (let i = 0; i < $sel.length; i++) {
        $sel.eq(i).val($sel.eq(i).data('default'));
    }
    $('#ptext-content').focus();
});

// 富文本重置
$('#rtext-btn-text-clear').click(rtextTextClear);

// 富文本保存段落
$('#rtext-btn-text-save').click(function() {
    let index = $('#editor-text-index-now').val();
    let message = {
        text: $('#rtext-text').val()
    };
    textList[index] = message;
    editorTextListUpdate();  
});

$('#editor-text-list-add').click(function() {
    rtextTextClear();
    let i = textList.push({text: ''});
    editorTextListUpdate();
    $('#editor-text-index-now').val(i - 1);
    $('.editor-text-index-now').text(i);
});

$('#rtext-btn-clear').click(function() {
    $('#rtext-text').val('');
    $('#rtext-style').val('');
    let $sel = $('.tabpage-panel[data-pageid="rtext"] input.reset');
    for (let i = 0; i < $sel.length; i++) {
        $sel.eq(i).val($sel.eq(i).data('default'));
    }
    textList = [
        {text: ''}
    ];
    editorTextListUpdate();
    $('#editor-text-index-now').val(0);
    $('.editor-text-index-now').text(1);
    $('#rtext-text').focus();
});

// 输出清空
$('#output-btn-clear').click(function() {
    $('#output-content').val('');
    $('#output-content').focus();
});

// 纯文本数据整理
function ptextSubmit() {
    let txt = $('#ptext-content').val();
    let username = $('#ptext-character').val();

    if ($('#ptext-chk-use-formatting-code').val() == 1) {
        txt = EchoLiveTools.formattingCodeToMessage(txt);
    }

    if ($('#ptext-chk-quote').val() == 1) {
        let before = $('#ptext-ipt-quote-before').val(),
            after  = $('#ptext-ipt-quote-after').val();

        if (typeof txt == 'string') {
            txt = before + txt + after;
        } else {
            txt = [before, ...txt, after];
        }
    }

    let d = {
        username: username,
        messages: [
            {
                message: txt
            }
        ]
    }

    if ($('#ptext-chk-more').val() == 1) {
        d.messages[0].data = {
            ...d.messages[0].data,
            ...{printSpeed: Number($('#ptext-ipt-print-speed').val())}
        };
    }

    return d;
}

// 纯文本提交
$('#ptext-btn-submit').click(function() {
    let d = ptextSubmit();

    $('#output-content').val(getOutputBefore() + JSON.stringify(d, null, 4) + getOutputAfter());
    $('#tabpage-nav-output, #tabpage-nav-output-content').click();
    $('#output-content').focus();
    $('#output-content').select();
});

// 纯文本发送
$('#ptext-btn-send').click(function() {
    let d = ptextSubmit();

    elb.sendData(d);
    sendHistoryMessage(d);

    editorLogT('editor.log.message.sent', { msg: EchoLiveTools.getMessageSendLog(d.messages[0].message, d.username) });
});

// 输出页发送
$('#output-btn-send').click(function() {
    let before      = getOutputBefore(),
        after       = getOutputAfter(),
        centent     = $('#output-content').val(),
        beforeCheck = centent.substring(0, before.length) == before,
        afterCheck  = centent.substring(centent.length - after.length, centent.length) == after,
        newCentent  = '';
    
    if (centent.length == 0) return editorLogT('editor.log.message.empty', {}, 'erro');
    
    if (beforeCheck && afterCheck) {
        newCentent = centent.substring(before.length, centent.length - after.length);
    } else {
        newCentent = centent;
    }

    let msg;

    try {
        msg = JSON.parse(newCentent);
        if (msg?.messages == undefined && msg?.username == undefined) return editorLogT('editor.log.message.empty_data', {}, 'erro');
        elb.sendData(msg);
    } catch (error) {
        editorLogT('editor.log.message.illegal', {}, 'erro');
        return;
    }

    if (msg.messages == undefined) {
        editorLogT('editor.log.message.empty_messages', {}, 'warn');
        return;
    }

    if (!Array.isArray(msg.messages) || msg.messages.length < 1) return;

    if (msg.messages.length > 1) {
        editorLogT('editor.log.message.sent_custom_multi', { msg: EchoLiveTools.getMessageSendLog(msg.messages[0].message, msg.username), n: msg.messages.length });
    } else {
        editorLogT('editor.log.message.sent_custom', { msg: EchoLiveTools.getMessageSendLog(msg.messages[0].message, msg.username) });
    }

    sendHistoryMessage(msg);
});



function ptextChkUseFormattingCodeChange(e) {
    if (e == 1) {
        $('.tabpage-panel[data-pageid="ptext"] .editor-controller').removeClass('disabled');
    } else {
        $('.tabpage-panel[data-pageid="ptext"] .editor-controller').addClass('disabled');
    }
}


function editorTextListUpdate() {
    $('.editor-text-list-content').html(EditorTextList.getList(textList));  
}

function rtextTextClear() {
    $('#rtext-text').val('');
    $('#rtext-style').val('');
    let $sel = $('.tabpage-panel[data-pageid="rtext"] .editor-text-item input.reset');
    for (let i = 0; i < $sel.length; i++) {
        $sel.eq(i).val($sel.eq(i).data('default'));
    }
    $('#rtext-text').focus();
}

function getOutputBefore() {
    let v = $('#config-output-use-before').val();
    if (v == 1) {
        return $('#config-output-before').val();
    } else {
        return '';
    }
}

function getOutputAfter() {
    let v = $('#config-output-use-after').val();
    if (v == 1) {
        return $('#config-output-after').val();
    } else {
        return '';
    }
}




function sendHistoryMessage(data) {
    let username = data.username;
    let message = $t('message_preview.undefined_message');
    if (Array.isArray(data.messages) && data.messages.length > 0) {
        message = EchoLiveTools.getMessagePlainText(data.messages[0].message)
    }
    let time = getTime();
    if (message == '') message = $t('message_preview.empty_message');
    if (username == undefined || username == '') username = $t('message_preview.empty_username');

    let l = history.push({
        data: data,
        time: time
    });
    $('#history-message-list').prepend(HistoryMessage.item(message, username, time, data.messages.length, l - 1));

    // 防止历史记录过多
    if (config.editor.history_maximum >= 0 && history.length > config.editor.history_maximum) {
        history.fill(undefined, historyMinimum, history.length - config.editor.history_maximum);
        historyMinimum = history.length - config.editor.history_maximum;
        $(`#history-message-list .history-message-item:gt(${config.editor.history_maximum - 1})`).remove();
    }

    // 防止底部游标过高
    if (config.advanced.editor.history_minimum_breaker_threshold >= 0 && historyMinimum >= config.advanced.editor.history_minimum_breaker_threshold) {
        history = history.splice(historyMinimum);
        let $list = $('#history-message-list .history-message-item');
        for (let i = 0; i < $list.length; i++) {
            const e = $list.eq(i);
            let di = e.find('button').data('index');
            e.find('button').data('index', di - historyMinimum);
        }
        historyMinimum = 0;
    }
}


// 编辑器控制器点击
$(document).on('click', '.editor-format-btn', function() {
    let editorID = $(this).data('editorid'),
        value = $(this).data('value');
    
    const format = {
        bold:               '@b',
        italic:             '@i',
        underline:          '@u',
        strikethrough:      '@s',
        font_size_increase: '@+',
        font_size_decrease: '@-',
        clear:              '@r'
    };

    let forceRepeatBefore = false;

    if (value == 'font_size_increase' || value == 'font_size_decrease') forceRepeatBefore = true;
    
    if (value == 'clear') {
        insertTextAtCursor(editorID, format.clear, '', false, false, false, true, function(e) {
            return e.replace(/(?<!\\)@(\[#[0-9a-fA-F]{3,8}\]|\S)/g, '');
        });
    } else if (value == 'color') {
        popupsDisplay('#popups-palette');
        popupsMoveToElement('#popups-palette', '.editor-controller button[data-value="color"]');
        $('#popups-palette-select').focus();
    } else {
        insertTextAtCursor(editorID, format[value], format.clear, false, forceRepeatBefore);
    }
});

// 拾色器色块点击
$(document).on('click', '#popups-palette .color-box', function() {
    let value = $(this).data('value');
    insertTextAtCursor('ptext-content', `@[${ value }]`, '@r');
    popupsDisplay('#popups-palette', false);
});

// 纯文本编辑器字数统计
$(document).on('input', '#ptext-content', function() {
    let length  = $(this).val().length;

    $('#ptext-editor .editor-bottom-bar .length').text($t('editor.form.text_length', { n: length }));
});
$(document).on('change', '#ptext-content', function() {
    let length  = $(this).val().length;

    $('#ptext-editor .editor-bottom-bar .length').text($t('editor.form.text_length', { n: length }));
});

// 历史记录编辑
$(document).on('click', '.history-message-item-btn-edit', function() {
    let i = $(this).data('index');

    $('#output-content').val(JSON.stringify(history[i].data, null, 4));
    $('#tabpage-nav-output, #tabpage-nav-output-content').click();
    $('#output-content').focus();
    $('#output-content').select();
});

// 历史记录发送
$(document).on('click', '.history-message-item-btn-send', function() {
    let i = $(this).data('index');
    let $item = $(this).parents('.history-message-item').eq(0);

    $item.find('.sent').text(HistoryMessage.sentAt(getTime()));
    $item.find('.sent').removeClass('hide');

    if (config.editor.history_resend_bubble) $('#history-message-list').prepend($item);
    
    elb.sendData(history[i].data);
    editorLogT('editor.log.message.resent');
});

// 历史页清空
$(document).on('click', '#history-btn-clear', function() {
    if (historyClearConfirm) {
        historyClearConfirm = false;
        history = [];
        historyMinimum = 0;
        $('#history-message-list').html('');
        $('#history-editor-controller').html(`<button id="history-btn-clear" class="fh-button fh-big fh-ghost fh-danger">${ $t('editor.history.clear') }</button>`);
        $('#history-btn-clear').focus();
    } else {
        historyClearConfirm = true;
        $('#history-editor-controller').html(`<button id="history-btn-clear-cancel" class="fh-button fh-big">${ $t('ui.cancel') }</button><button id="history-btn-clear" class="fh-button fh-big fh-danger">${ $t('editor.history.clear_confirm') }</button>`)
        $('#history-btn-clear-cancel').focus();
    }
});

// 历史页取消清空
$(document).on('click', '#history-btn-clear-cancel', function() {
    historyClearConfirm = false;
    $('#history-editor-controller').html(`<button id="history-btn-clear" class="fh-button fh-big fh-ghost fh-danger">${ $t('editor.history.clear') }</button>`);
    $('#history-btn-clear').focus();
});

// 仪表盘点击
$(document).on('click', '.echo-live-client-state-block', function(e) {
    const name = $(this).data('name');
    const r = elb.clients.filter((e) => {
        return e.name == name;
    })[0];
    if (r.messagesCount > 0 && !r.hidden) {
        console.log(name);
        if (name.search(/^[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}$/i) == 0) {
            elb.sendNext(name);
        } else {
            elb.sendNext('@' + name);
        }
        editorLogT('editor.log.broadcast.echo_next_from_self_to_target', { name: name });
    }
});



// 彩蛋
function getDateNumber() {
    let d = new Date();
    return `${afterZero(d.getMonth() + 1)}${afterZero(d.getDate())}`;
}

function checkNowDate() {
    let d = new Date();
    let dn = getDateNumber();
    editorLogT('editor.log.welcome', {}, 'tips');
    editorLog(`Language: ${ $t('lang.title') } (ISO 639-3: ${ $t('lang.code_iso_639_3') }, IETF: ${ $t('lang.code_ietf') })`, 'dbug');
    let msg = {
        '0101': `${d.getFullYear()} 年来了！感谢您一直以来对 Echo-Live 的支持！`,
        '0229': '你知道吗：今年是闰年。',
        '0401': [
            '想给你的消息加点料吗？不如试试这个：https://sheep-realms.github.io/Abuser/',
            '近日电信诈骗频发，提高反诈意识你我在行动。邀您阅读反诈指南：https://sheep-realms.github.io/Anti-Fraud-Guidelines/'
        ],
        '0721': 'Ciallo～(∠·ω< )⌒★',
        '0914': '2023 年的今天，Echo Live 诞生了！',
        '1231': '哇哦，今年只剩下最后一天了，您要和我一起跨年吗？'
    }

    if (msg[dn] != undefined) {
        if (Array.isArray(msg[dn])) {
            editorLog(msg[dn][Math.floor(Math.random() * msg[dn].length)], 'tips');
        } else {
            editorLog(msg[dn], 'tips');
        }
    }
}