class UserController {
    constructor(formIdCreate, formIdUpdate, tableId) {
        this.formEl = document.getElementById(formIdCreate);
        this.formIdUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit() {
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e => {
            this.showPanelCreate();
        });

        this.formIdUpdateEl.addEventListener('submit', event => {
            event.preventDefault();

            let btn = this.formIdUpdateEl.querySelector('[type=submit]');
            btn.disable = true;
            let values = this.getValues(this.formIdUpdateEl);
            let index = this.formIdUpdateEl.dataset.trIndex;
            let tr = this,tableEl.rows[index];
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formIdUpdateEl)
            .then(content =>{
                if(!values.photo) {
                    result._photo = userOld._photo;
                } else {
                    result._photo = content;
                }

                let user = new User();
                user.loadFromJSON(result);
                user.save();
                this.getTr(user, tr);
                this.updateCount();
                this.formIdUpdateEl.reset();
                btn.disabled = false;
                this.showPanelCreate();

            }, e => console.error(e) );
        });
    }

    onSubmit() {
        this.formEl.addEventListener('submit', event => {
            event.preventDefault();
            let btn = this.formEl.querySelector('[type=submit]');
            btn.disbled = true;
            let values = this.getValues(this.formEl);
            if(!values) return false;
            this.getPhoto(this.formEl)
                .then((content) => {
                    values.photo = content;
                    values.save();
                    this.addLine(values);
                    this.formEl.reset();
                    btn.disbled = false;
                }, (e) => console.error(e));
        });
    }

    getPhoto(formEl) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            let elements = [...formEl.elements].filter(item => {
                if(item.name === 'photo') {
                    return item;
                }
            });

        let file = elements[0].files[0];
        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (e) => {
            reject(e);
        };

        if(file) {
            fileReader.readAsDataURL(file);
        } else {
            resolve('dist/img/boxed-bg.jpg');
        }
        });
    }

    getValues(formEl) {
        let user = {};
        let isValid = true;
        [...formEl.elements].forEach((field, index) => {
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.values) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if(field.name == 'gender') {
                if(field.checked) {
                    user[field.name] = field.value;
                }
            } else if(field.name == 'admin') {
                user[field.name] == field.checked;
            } else {
                user[field.name] == field.value;
            }
        });

        if(!isValid) {
            return false;
        }

        return  new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }

    selectAll() {
        let users = User.getUsersStorage();
        users.forEach(dataUser => {
            let user = new User();
            user.loadFromJSON(dataUser);
            this.addLine(user);
        });
    }


}