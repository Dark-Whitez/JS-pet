(function () {
    //создаем список
    let todoArr = [];
    let listName = '';

    //генерируем уникальный индефикатор
    function generatedId(arr) {
        let maxGenId = 0;
        for (let item of arr) {
            if (item.id > maxGenId) {
                maxGenId = item.id;
            }
        }
        return maxGenId + 1;
    };

    //создаем заголовок
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    };

    //создаем форму
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function (e) {
            e.preventDefault();
            if (input.value.length > 0) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        return {
            form,
            input,
            button,
        };
    };

    //создаем список в html
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    };

    //создаем кнопки и элементы для списка
    function createTodoItem(obj) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        //проверка на условие(Если (объект.done === истина), то покрась элемент в цвет класса(в данном случае в зеленый))
        if (obj.done === true) item.classList.add('list-group-item-success');

        //обработчик клика на кнобку готова
        doneButton.addEventListener('click', function () {
            for (let listItem of todoArr) {
                if (listItem.id === obj.id) {
                    if (listItem.done === false) {
                        item.classList.toggle('list-group-item-success');
                        listItem.done = true;
                    } else {
                        item.classList.toggle('list-group-item-success');
                        listItem.done = false;
                    }
                }
            }
            setCartData(dataToJson(todoArr), listName);
        });
        //обработчик клика на кнобку удалить
        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                item.remove();
                for (let i = 0; i < todoArr.length; i++) {
                    if (todoArr[i].id === obj.id) {
                        todoArr.splice(i, 1);
                    }
                }
                setCartData(dataToJson(todoArr), listName);
            }
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };
    };

    //данный метод вернет входящие данные виде строки
    function dataToJson(todoArr) {
        return JSON.stringify(todoArr);
    };

    //дынный метод вернет входящую строку в виде данных
    function jsonToData(data) {
        return JSON.parse(data);
    };

    //данный метод вернет данные из локального хранилища
    function getCartData(listName) {
        return localStorage.getItem(listName);
    };

    //данный метод запишит данные в локальное хранилище
    function setCartData(todoArr, listName) {
        return localStorage.setItem(listName, todoArr);
    };

    //основная функция по созданию Todo
    function createTodoApp(container, title = 'Список дел', keyName) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        if (getCartData(listName) !== null && getCartData(listName) !== '') {
            todoArr = jsonToData(getCartData(listName));
        }

        for (let itemList of todoArr) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            //создаем объект
            let todoItemObj = {
                id: generatedId(todoArr),
                name: todoItemForm.input.value,
                done: false,
            }

            let todoItem = createTodoItem(todoItemObj);

            todoArr.push(todoItemObj);

            setCartData(dataToJson(todoArr), listName);

            todoList.append(todoItem.item);
            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';
        });
    };

    window.createTodoApp = createTodoApp;
})();