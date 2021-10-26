function Validator(selector) {
    function validate(inputElement, rule) {
        var MassesEror
        var inputParent = parentE(inputElement, selector.formGourpSelector)
        var currentRule = Selectorrules[rule.selector]
        for (var i = 0; i < currentRule.length; i++) {
            MassesEror = currentRule[i](inputElement.value)
            if (MassesEror)
                break;
        }
        if (MassesEror) {
            inputParent.querySelector(selector.errorSelector).innerText = MassesEror,
            inputParent.classList.add('invalid')
        } else {
            inputParent.querySelector(selector.errorSelector).innerText = MassesEror
            console.log( inputParent.querySelector(rule.selector))
            inputParent.classList.remove('invalid')
        }
        return !MassesEror
    }

    function parentE(inputElement, selector) {
        while (inputElement.parentElement) {
            if (inputElement.parentElement.matches(selector)) {
                return inputElement.parentElement
            } else {
                inputElement = inputElement.parentElement
            }
        }
    }
    var formElement = document.querySelector(selector.form)
    if (formElement) {
        var Selectorrules = {}
        formElement.onsubmit = function (e) {
            e.preventDefault()
            var isValid = true
            selector.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector)
                isValid = validate(inputElement, rule)
            })
            if (isValid) {
                if (typeof selector.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        console.log
                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});
                    console.log(formValues)
                    selector.onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }


            }
        }
        selector.rules.forEach(rule => {
            var inputElement = formElement.querySelector(rule.selector)
            if (Array.isArray(Selectorrules[rule.selector])) {
                Selectorrules[rule.selector].push(rule.test)
            } else {
                Selectorrules[rule.selector] = [rule.test]
            }
            if (inputElement) {
                var inputParent = parentE(inputElement, selector.formGourpSelector)
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }
                inputElement.oninput = function () {
                    inputParent.querySelector(selector.errorSelector).innerText = ''
                    inputParent.classList.remove('invalid')
                }
            }
        })

    }
}


Validator.isRequired = function (selector, messen) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? '' : messen || 'Vui lòng nhập lại'
        }
    }
}
Validator.isEmail = function (selector, messen) {
    return {
        selector: selector,
        test: function (value) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value) ? '' : messen || 'Vui lòng nhập Email'
        }
    }
}
Validator.minLength = function (selector, minValue, messen) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim().length >= minValue ? '' : messen || ` Vui lòng nhập tối thiểu ${minValue} ký tự`
        }
    }
}
Validator.checkPass = function (selector, password, messen) {
    return {
        selector: selector,
        test: function (value) {
            return value === password() ? '' : messen || 'Nhập lại'
        }
    }
}