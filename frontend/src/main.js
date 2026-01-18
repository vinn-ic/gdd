import Chart from 'chart.js/auto'


const ipHost = location.hostname


const btnAddAccount = document.getElementById("btnAddAccount")
const btnEditAccount = document.getElementById("btnEditAccount")

const graficoPie = document.getElementById("graficoPie");
const graficoBar = document.getElementById("graficoBar")

window.addEventListener("load", async () => {
  const areaTabela = document.getElementById("areaTabela")
  let dataTime = new Date()


  const response = await fetch("http://" + ipHost + ":8080/showTabela.php")
  const data = await response.json()
  console.log(data)
  let total = 0
  let id = 0

  areaTabela.innerHTML = ""




  //apagar depois esse forEach
  data.tabela.forEach(tabela => {
    id++;
    if (!tabela.boolPaid) {
      total += tabela.value
    }
  })

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

  for (var i = 0; i < id; i++) {
    var tabela = data.tabela[i];

    if (tabela.boolPaid) {

      areaTabela.innerHTML += `
        <tr class="green">
          <td class="tabelaName" data-id="${tabela.id}" data-boolpaid="${tabela.boolPaid}" >${tabela.id}:${tabela.name}<br> <i>${tabela.obs}</i></td>
          <td>${tabela.value}</td>
          <td>${tabela.endDate}</td>
        </tr>       
      `
    } else if (convertDate(tabela.endDate) < dataTime) {
      areaTabela.innerHTML += `
        <tr class="red">
          <td class="tabelaName" data-id="${tabela.id}" data-boolPaid="${tabela.boolPaid}" >${tabela.id}:${tabela.name}<br> <i>${tabela.obs}</i></td>
          <td>${tabela.value}</td>
          <td>${tabela.endDate}</td>
        </tr>       
      `
    } else if (!tabela.boolPaid) {
      areaTabela.innerHTML += `
        <tr>
          <td class="tabelaName" data-id="${tabela.id}" data-boolPaid="${tabela.boolPaid}" >${tabela.id}:${tabela.name}<br> <i>${tabela.obs}</i></td>
          <td>${tabela.value}</td>
          <td>${tabela.endDate}</td>
        </tr>       
      `
    }


  }


  console.log("iniciando graficos...")

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

areaTabela.addEventListener("mouseup", (e) => {
  const td = e.target.closest(".tabelaName")
  if (!td) return

  const id = td.dataset.id;
  const boolPaid = td.dataset.boolpaid

  changePaid(id, boolPaid)


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

  window.location.reload()
}
const formAdd = document.getElementById("formAddAccount")
btnAddAccount.addEventListener("click", async () => {
  formAdd.style.display = "block";
})

const btnSubmitAddAccount = document.getElementById("buttonSubmitAdd");
btnSubmitAddAccount.addEventListener("click", async (e) => {
  e.preventDefault();

  await fetch("http://" + ipHost + ":8080/AddAccount.php", {
    method: "POST",
    body: new FormData(formAdd)
  })
  window.location.reload()
})



const formEdit = document.getElementById("formEditAccount")
btnEditAccount.addEventListener("click", async () => {
  formEdit.style.display = "block"
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



