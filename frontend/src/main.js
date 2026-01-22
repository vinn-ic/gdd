import Chart from 'chart.js/auto'


const ipHost = location.hostname


const btnAddAccount = document.getElementById("btnAddAccount")
const btnEditAccount = document.getElementById("btnEditAccount")

const graficoPie = document.getElementById("graficoPie");
const graficoBar = document.getElementById("graficoBar")
const areaTabela = document.getElementById("areaTabela")

let data = []
let id = 0;

window.addEventListener("load", async () => {
  const response = await fetch("http://" + ipHost + ":8080/showTabela.php")
  data = await response.json()

  let total = 0;

  data.tabela.forEach(tabela => {
    id++;
    if (!tabela.boolPaid) {
      total += tabela.value
    }
  })


  console.log(data)

  areaTabela.innerHTML = ""

  console.log("iniciando graficos...")

  renderTable()



  const filt = data.tabela.filter(row => row.boolPaid == 0)
  new Chart(
    graficoPie,
    {
      type: 'doughnut',
      data: {
        labels: filt.map(row => row.name),
        datasets: [{
          label: 'valor',
          data: filt.map(row => row.value),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(99,86,255)'
          ],
          hoverOffset: id
        }]
      },
    }
  )
  new Chart(
    graficoBar,
    {
      type: 'bar',
      data: {
        labels: filt.map(row => row.name),
        datasets: [{
          label: "valor",
          data: filt.map(row => row.value),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      }
    }
  )
})

function convertDate(d) {
  const [dia, mes, ano] = d.split("/").map(Number)
  return new Date(ano, mes - 1, dia)

}
function renderTable() {
  let dataTime = new Date()

  data.tabela.sort((a, b) => {
    const dataA = convertDate(a.endDate)
    const dataB = convertDate(b.endDate)

    const boolPaidA = a.boolPaid
    const boolPaidB = b.boolPaid

    const dataAPast = dataA < dataTime
    const dataBPast = dataB < dataTime

    if (boolPaidA && !boolPaidB) return 1
    if (!boolPaidA && boolPaidB) return -1

    if (!dataAPast && !dataBPast) return dataA - dataB;
    if (dataAPast && dataBPast) return dataB - dataA;

    return dataAPast ? -1 : 1
  })
  console.log(data)

  areaTabela.innerHTML = ""
  for (var i = 0; i < id; i++) {
    var tabela = data.tabela[i];

    if (tabela.boolPaid) {
      areaTabela.innerHTML += `
        <tr class="table-success" id="idTr">
          <td>${tabela.id}</td>
          <td class="tabelaName" data-id="${tabela.id}" data-boolPaid="${tabela.boolPaid}" >${tabela.name}<br> <i>${tabela.obs}</i></td>
          <td>${tabela.value}</td>
          <td>${tabela.endDate}</td>
        </tr>       
      `
    } else if (convertDate(tabela.endDate) < dataTime) {
      areaTabela.innerHTML += `
        <tr class="table-danger" id="idTr">
          <td>${tabela.id}</td>
          <td class="tabelaName" data-id="${tabela.id}" data-boolPaid="${tabela.boolPaid}" >${tabela.name}<br> <i>${tabela.obs}</i></td>
          <td>${tabela.value}</td>
          <td>${tabela.endDate}</td>
        </tr>       
      `
    } else if (!tabela.boolPaid) {
      areaTabela.innerHTML += `
        <tr id="idTr">
          <td>${tabela.id}</td>
          <td class="tabelaName" data-id="${tabela.id}" data-boolPaid="${tabela.boolPaid}" >${tabela.name}<br> <i>${tabela.obs}</i></td>
          <td>${tabela.value}</td>
          <td>${tabela.endDate}</td>
        </tr>       
      `
    }
  }
}
areaTabela.addEventListener("mouseup", (e) => {
  const td = e.target.closest(".tabelaName")
  if (!td) return
  const tr = e.target.closest("#idTr")

  const findId = data.tabela.findIndex(i => i.id == td.dataset.id)

  console.log(findId)
  let boolPaid = data.tabela[findId].boolPaid
  let id = data.tabela[findId].id
  changePaid(id, boolPaid)

  if (data.tabela[findId].boolPaid == 0) {
    tr.classList.add("table-success")
    data.tabela[findId].boolPaid = 1
    td.dataset.boolPaid = 1
  } else if (data.tabela[findId].boolPaid == 1) {
    tr.classList.remove("table-success")
    data.tabela[findId].boolPaid = 0
    td.dataset.boolPaid = 0
  }
  renderTable()


})



async function changePaid(id, boolPaid) {
  console.log(id)
  console.log(boolPaid)
  await fetch("http://" + ipHost + ":8080/changeTabela.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "idAccount=" + id + "&boolPaid=" + boolPaid,
  })

  //window.location.reload()
}
const btnSubmitAddAccount = document.getElementById("buttonSubmitAdd");
btnSubmitAddAccount.addEventListener("click", async (e) => {
  e.preventDefault();

  await fetch("http://" + ipHost + ":8080/AddAccount.php", {
    method: "POST",
    body: new FormData(formAdd)
  })
  window.location.reload()
})


const btnSubmitEdit = document.getElementById("buttonSubmitEdit")

btnSubmitEdit.addEventListener("click", async (e) => {
  e.preventDefault()
  await fetch("http://" + ipHost + ":8080/changeTabela.php", {
    method: "POST",
    body: new FormData(formEdit)
  })
  window.location.reload()

})

const btnDeleteAccount = document.getElementById("btnDeleteAccount")
btnDeleteAccount.addEventListener("click", async (e) => {
  alert("isso vai apagar a conta do banco de dados!")

  await fetch("http://" + ipHost + ":8080/deleteAccount.php", {
    method: "POST",
    body: new FormData(formEdit)
  })
  window.location.reload()

})
