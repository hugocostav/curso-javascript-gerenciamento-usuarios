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
}