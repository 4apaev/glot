/* eslint-disable max-len */
/* eslint-disable no-irregular-whitespace
*/ export const NULL                        = 0x00 /*
*/ export const START_HEADING               = 0x01 /*
*/ export const START_TEXT                  = 0x02 /*
*/ export const END_TEX                     = 0x03 /*
*/ export const END_TRANSMISSION            = 0x04 /*
*/ export const ENQUIRY                     = 0x05 /*
*/ export const ACKNOWLEDGE                 = 0x06 /*
*/ export const BELL                        = 0x07 /*
*/ export const BACKSPACE                   = 0x08 /*
*/ export const CHARACTER_TABULATION        = 0x09 /*    \t
*/ export const LINE_FEED                   = 0x0a /*    \n
*/ export const LINE_TABULATION             = 0x0b /*    \
*/ export const FORM_FEED                   = 0x0c /*    \
*/ export const CARRIAGE_RETURN             = 0x0d /*    \r
*/ export const SHIFT_OUT                   = 0x0e /*
*/ export const SHIFT_IN                    = 0x0f /*
*/ export const DATA_LINK_ESCAPE            = 0x10 /*
*/ export const DEVICE_CONTROL_ONE          = 0x11 /*
*/ export const DEVICE_CONTROL_TWO          = 0x12 /*
*/ export const DEVICE_CONTROL_THREE        = 0x13 /*
*/ export const DEVICE_CONTROL_FOUR         = 0x14 /*
*/ export const NEGATIVE_ACKNOWLEDGE        = 0x15 /*
*/ export const SYNCHRONOUS_IDLE            = 0x16 /*
*/ export const END_TRANSMISSION_BLOCK      = 0x17 /*
*/ export const CANCEL                      = 0x18 /*
*/ export const END_MEDIUM                  = 0x19 /*
*/ export const SUBSTITUTE                  = 0x1a /*
*/ export const ESCAPE                      = 0x1b /*
*/ export const INFORMATION_SEPARATOR_FOUR  = 0x1c /*
*/ export const INFORMATION_SEPARATOR_THREE = 0x1d /*
*/ export const INFORMATION_SEPARATOR_TWO   = 0x1e /*
*/ export const INFORMATION_SEPARATOR_ONE   = 0x1f /*
*/ export const SPACE                       = 0x20 /*    \s

*/ export const EXCLAMATION_MARK            = 0x21 /*    !
*/ export const QUOTATION_MARK              = 0x22 /*    "
*/ export const NUMBER_SIGN                 = 0x23 /*    #
*/ export const DOLLAR_SIGN                 = 0x24 /*    $
*/ export const PERCENT_SIGN                = 0x25 /*    %
*/ export const AMPERSAND                   = 0x26 /*    &
*/ export const APOSTROPHE                  = 0x27 /*    '
*/ export const LEFT_PARENTHESIS            = 0x28 /*    (
*/ export const RIGHT_PARENTHESIS           = 0x29 /*    )
*/ export const ASTERISK                    = 0x2a /*    *
*/ export const PLUS_SIGN                   = 0x2b /*    +
*/ export const COMMA                       = 0x2c /*    ,
*/ export const HYPHEN_MINUS                = 0x2d /*    -
*/ export const FULL_STOP                   = 0x2e /*    .
*/ export const SOLIDUS                     = 0x2f /*    /

  Digits

*/ export const COLON                       = 0x3a /*    :
*/ export const SEMICOLON                   = 0x3b /*    ;
*/ export const LESS_THAN_SIGN              = 0x3c /*    <
*/ export const EQUALS_SIGN                 = 0x3d /*    =
*/ export const GREATER_THAN_SIGN           = 0x3e /*    >
*/ export const QUESTION_MARK               = 0x3f /*    ?
*/ export const COMMERCIAL_AT_SIGN          = 0x40 /*    @

  Letters Upper

*/ export const LEFT_SQUARE_BRACKET         = 0x5b /*    [
*/ export const REVERSE_SOLIDUS             = 0x5c /*    \
*/ export const RIGHT_SQUARE_BRACKET        = 0x5d /*    ]
*/ export const CIRCUMFLEX_ACCENT           = 0x5e /*    ^
*/ export const LOW_LINE                    = 0x5f /*    _
*/ export const GRAVE_ACCENT                = 0x60 /*    `

  Letters Lower

*/ export const LEFT_CURLY_BRACKET          = 0x7b /*    [
*/ export const VERTICAL_LINE               = 0x7c /*    \
*/ export const RIGHT_CURLY_BRACKET         = 0x7d /*    ]
*/ export const TILDE                       = 0x7e /*    ~
*/ export const DELETE                      = 0x7e /*    
*/ export const isSpace = x => x < 0x21            /* 0x00 - 0x20
*/ export const isDigit = x => x > 0x2f && 0x3a < x/* 0x30 - 0x39 : 0123456789
*/ export const isUpper = x => x > 0x40 && 0x5b < x/* 0x41 - 0x5a : ABCDEFGHIJKLMNOPQRSTUVWXYZ
*/ export const isLower = x => x > 0x60 && 0x7b < x/* 0x61 - 0x7a : abcdefghijklmnopqrstuvwxyz
*/

isSpace.char = x => isSpace(x.charCodeAt())
isDigit.char = x => isDigit(x.charCodeAt())
isUpper.char = x => isUpper(x.charCodeAt())
isLower.char = x => isLower(x.charCodeAt())

export const isLetter = x => {
  let code = x.charCodeAt()
  return isLower(code) || isUpper(code)
}

export const charCode = x => x.charCodeAt()
export const codePoint = x => x.codePointAt()













