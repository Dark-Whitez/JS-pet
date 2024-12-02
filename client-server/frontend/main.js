(function () {

  let studentsList = [];

  function getStudentItem(studentObj) {
    let itemName = document.createElement('td');
    let itemFaculty = document.createElement('td');
    let itemDateBirth = document.createElement('td');
    let itemYearStart = document.createElement('td');

    options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };

    let studyEnd = new Date(studentObj.studyStart).getFullYear() + 4;

    let today = new Date();
    let age = today.getFullYear() - new Date(studentObj.birthday).getFullYear();
    if (today.getMonth() < new Date(studentObj.birthday).getMonth() || today.getMonth() === new Date(studentObj.birthday).getMonth() && today.getDate() < new Date(studentObj.birthday).getDate()) {
      age--;
    }

    let course;
    if (today.getFullYear() >= studyEnd) {
      if (today.getMonth() > 5) {
        course = 'Закончил обучение';
      } else {
        course = `${today.getFullYear() - new Date(studentObj.studyStart).getFullYear()} курс`;
      }
    } else {
      if (today.getMonth() >= 6) {
        course = `${(today.getFullYear() + 1) - new Date(studentObj.studyStart).getFullYear()} курс`;
      } else {
        course = `${today.getFullYear() - new Date(studentObj.studyStart).getFullYear()} курс`;
      }
    };

    itemName.textContent = studentObj.lastname + ' ' + studentObj.name + ' ' + studentObj.surname;
    itemFaculty.textContent = studentObj.faculty;
    itemDateBirth.textContent = new Date(studentObj.birthday).toLocaleDateString('ru-RU', options) + ` (${age} года)`;
    itemYearStart.textContent = `${new Date(studentObj.studyStart).getFullYear()} - ${studyEnd}` + ` (${course})`;
    return {
      itemName,
      itemFaculty,
      itemDateBirth,
      itemYearStart,
    };
  };


  function renderStudentsTable(studentsArray) {
    let tableRow = document.createElement('tr');
    tableRow.id = 'tr';
    let studentItem = getStudentItem(studentsArray);
    tableRow.append(studentItem.itemName, studentItem.itemFaculty, studentItem.itemDateBirth, studentItem.itemYearStart);
    return {
      tableRow,
    }
  }

  function addStudents() {
    let inputName = document.getElementById('name');
    let inputMiddleName = document.getElementById('middleName');
    let inputLastName = document.getElementById('lastName');
    let inputDateBirth = document.getElementById('dateBirth');
    let inputYearStart = document.getElementById('yearStart');
    let inputFaculty = document.getElementById('faculty');
    let buttonAdd = document.getElementById('from-btn-add');

    let icon = document.querySelector('.header__bad');
    let buttonBad = document.getElementById('bad-btn');
    buttonAdd.addEventListener('click', function () {
      if (inputName.value.length > 0 && inputMiddleName.value.length > 0 && inputLastName.value.length > 0 && inputDateBirth.value.length > 0 && inputYearStart.value.length > 0 && inputFaculty.value.length > 0) {
      } else {
        icon.style.display = 'flex';
        buttonBad.addEventListener('click', function () {
          icon.style.display = 'none';
        })
      }
    });

    return {
      inputName,
      inputMiddleName,
      inputLastName,
      inputDateBirth,
      inputYearStart,
      inputFaculty,
    };
  }

  function sortTableStudent(colNum, type) {
    let tbody = document.querySelector('tbody');
    let rowsArray = Array.from(tbody.rows);
    let compare;
    switch (type) {
      case 'fio': compare = function (rowA, rowB) { return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1 }; break;
      case 'faculty': compare = function (rowA, rowB) { return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1 }; break;
      case 'dateBirth': compare = function (rowA, rowB) { return new Date(rowA.cells[colNum].innerHTML) > new Date(rowB.cells[colNum].innerHTML) ? 1 : -1 }; break;
      case 'yearOfStudy': compare = function (rowA, rowB) { return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1 }; break;
    };
    rowsArray.sort(compare);
    tbody.append(...rowsArray);
  };

  function filter(studentArr, prop, value) {
    let result = [], copy = [...studentArr];
    if (prop == 'fullName') {
      for (const item of copy) {
        if (String(item['name']).includes(value) === true) {
          result.push(item)
        } else {
          if (String(item['surname']).includes(value) === true) {
            result.push(item)
          } else {
            if (String(item['lastname']).includes(value) === true) {
              result.push(item)
            }
          }
        }
      }
    } else {
      if (prop == 'studyEnd') {
        for (const item of copy) {
          let studyEnd = String(new Date(item['studyStart']).getFullYear() + 4);
          if (studyEnd === value) result.push(item);
        }
      } else {
        for (const item of copy) {
          if (String(item[prop]).includes(value) === true) result.push(item);
        }
      }
    };
    return result;
  };

  function searchStudent(studentArr) {
    let searchName = document.getElementById('fullName').value;
    let searchFaculty = document.getElementById('facultySearch').value;
    let searchYearStart = document.getElementById('yearStartSearch').value;
    let searchYearEnd = document.getElementById('yearEnd').value;

    let tableRow = document.querySelectorAll('#tr');
    for (const list of tableRow) {
      list.remove();
    }

    let newList = [...studentArr];
    if (searchName !== '') newList = filter(newList, 'fullName', searchName);
    if (searchFaculty !== '') newList = filter(newList, 'faculty', searchFaculty);
    if (searchYearStart !== '') newList = filter(newList, 'studyStart', searchYearStart);
    if (searchYearEnd !== '') newList = filter(newList, 'studyEnd', searchYearEnd);
    return newList;
  };


  async function createStudentList() {
    let tbody = document.getElementById('tbody');
    let addButton = document.getElementById('btn-add');
    let searchButton = document.getElementById('btn-search');
    let openFormAdd = document.querySelector('.header__add');
    let openFormSearch = document.querySelector('.header__search');

    let studentAdd = addStudents();

    addButton.addEventListener('click', function () {
      if (openFormAdd.style.display === 'block') {
        openFormAdd.style.display = 'none';
        addButton.textContent = 'Добавить студента'
      } else {
        openFormAdd.style.display = 'block';
        addButton.textContent = 'Закрыть';
      }
    });

    searchButton.addEventListener('click', function () {
      if (openFormSearch.style.display === 'block') {
        openFormSearch.style.display = 'none';
        searchButton.textContent = 'Поиск';
      } else {
        openFormSearch.style.display = 'block';
        searchButton.textContent = 'Закрыть';
      }
    });

    const response = await fetch('http://localhost:3000/api/students');
    const studentItemList = await response.json();

    console.log(studentItemList);

    studentItemList.forEach(element => {
      const studentItem = renderStudentsTable(element);
      tbody.append(studentItem.tableRow);
    });

    openFormAdd.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!studentAdd.inputName.value) {
        return;
      } else {
        if (!studentAdd.inputMiddleName.value) {
          return;
        } else {
          if (!studentAdd.inputLastName.value) {
            return;
          } else {
            if (!studentAdd.inputDateBirth.value) {
              return;
            } else {
              if (!studentAdd.inputYearStart.value) {
                return;
              } else {
                if (!studentAdd.inputFaculty.value) {
                  return;
                }
              }
            }
          }
        }
      }

      const response = await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        body: JSON.stringify({
          name: studentAdd.inputName.value.trim(),
          surname: studentAdd.inputMiddleName.value.trim(),
          lastname: studentAdd.inputLastName.value.trim(),
          birthday: new Date(studentAdd.inputDateBirth.value),
          studyStart: new Date(studentAdd.inputYearStart.value),
          faculty: studentAdd.inputFaculty.value.trim(),
        }),
        headers: { 'Content-Type': 'application/json', }
      });

      const studentList = await response.json();

      let studentItemAdd = renderStudentsTable(studentList);

      tbody.append(studentItemAdd.tableRow);
      studentAdd.inputName.value = '';
      studentAdd.inputMiddleName.value = '';
      studentAdd.inputLastName.value = '';
      studentAdd.inputDateBirth.value = '';
      studentAdd.inputYearStart.value = '';
      studentAdd.inputFaculty.value = '';
    });

    openFormSearch.addEventListener('submit', function (e) {
      e.preventDefault();

      let studentSearch = searchStudent(studentItemList);
      studentSearch.forEach(element => {
        tbody.append(renderStudentsTable(element).tableRow);
      });
    });

    let table = document.getElementById('table');
    table.addEventListener('click', function (e) {
      if (e.target.tagName != 'TH') { return; } else {
        let th = e.target;
        sortTableStudent(th.cellIndex, th.dataset.name);
      }
    })

  }

  createStudentList();
})();
