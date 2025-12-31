import validator from "validator"

class Converter {
    static passwordRegex = /^([a-zA-Z0-9]{6,20})$/  // min is 6 and without special char
    static phoneNumberRegex = /^\d{10}$/   // min 10 number
    static emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/  // format abc@abc

    static validate(data, type) {
        let validate
        switch (type) {
            case "empty":
                validate = String(data).trim() !== ""
                break
            case "phoneNumber":
                validate = this.phoneNumberRegex.test(String(data).trim())
                break
            case "email":
                validate = this.emailRegex.test(String(data).trim())
                break
            case "birthDate":
                validate = Date.parse(data) <= Date.parse(new Date().toISOString().slice(0, 10))
                break
            case "webSite":
                validate = validator.isURL(data)
                break
            default:
                validate = false
                break
        }
        return validate
    }

    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error)
        })
    }

    static getFile(base64, name) {
        const byteString = atob(base64);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }
        const file =  new File([new Blob([ab], {
            type: 'application/pdf',
        })], name,{type:"application/pdf"}, 'utf-8');
        const container = new DataTransfer();
        container.items.add(file)
        return container.files
    }

    static getImage(base64, name) {
        const byteString = atob(base64);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }
        const file =  new File([new Blob([ab], {
            type: 'image/png',
        })], name,{type:"image/png"}, 'utf-8');
        const container = new DataTransfer();
        container.items.add(file)
        return container.files
    }

    static removeSpace(str) {
        str = str.trim()
        return str.replace(/\s+/g, ' ').trim()
    }
    // static replaceCode(str) {
    //     str = this.removeSpace(str)
    //     str = str.toLowerCase();
    //     str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    //     str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    //     str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    //     str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    //     str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    //     str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    //     str = str.replace(/đ/g, "d");
    //     // Some system encode vietnamese combining accent as individual utf-8 characters
    //     str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    //     str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    //
    //     return str = str.replace(/\s/g, '-')
    // }
}

export default Converter;