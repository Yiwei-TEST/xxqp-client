var AESUtil = {
    // CBC加密
    encryptCBC:function(text, textKey) {
        // 密钥转成16进制的字符串
        var key = CryptoJS.enc.Utf8.parse(textKey);
        // 加密过程
        var encrypted = CryptoJS.AES.encrypt(text, key, {
            // iv偏移量为key值
            iv: key,
            // 模式为CBC
            mode: CryptoJS.mode.CBC,
            // DES加密padding为Pkcs7
            padding: CryptoJS.pad.Pkcs7
        });
        // 加密返回为字符串密文(加密经过一次base64加密，结果可看结果)
        return encrypted.toString();
    },

    decryptCBC:function(cipherText, textKey) {
        var key = CryptoJS.enc.Utf8.parse(textKey);
        var decrypt = CryptoJS.AES.decrypt(cipherText, key, {
            iv: key,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // 解密返回转为UTF-8明文(解密也经过一次base64解密)
        return decrypt.toString(CryptoJS.enc.Utf8);
    },


    encryptECB:function(text, textKey) {
        //把私钥转换成16进制的字符串
        var key = CryptoJS.enc.Utf8.parse(textKey);
        //模式为ECB padding为Pkcs7
        var encrypted = CryptoJS.AES.encrypt(text, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        //加密出来是一个16进制的字符串
        return encrypted.ciphertext.toString();
    },

    decryptECB:function(cipherText, textKey) {
        //把私钥转换成16进制的字符串
        var key = CryptoJS.enc.Utf8.parse(textKey);
        //把需要解密的数据从16进制字符串转换成字符byte数组
        var decrypted = CryptoJS.AES.decrypt({
            ciphertext: CryptoJS.enc.Hex.parse(cipherText)
        }, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        //以utf-8的形式输出解密过后内容
        return decrypted.toString(CryptoJS.enc.Utf8);
    },

    encryptHttp:function(text) {
        var  _text  = this.encryptCBC(text,"dKPVJ60PJS8mlONb");
        return _text;
    },


    decryptHttp:function(cipherText) {
        var  _text  = this.decryptCBC(cipherText,"dKPVJ60PJS8mlONb");
        return _text;
    }
}


