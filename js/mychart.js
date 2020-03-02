fetch('/db/kordata')
    .then(function(response){
        return response.json();
    })
    .then(function(myJson){
        //console.log(JSON.stringify(myJson));

        const summary = myJson[0];

        const detail = myJson[1];

        //sortJson(detail,'total',"int",false);
        //console.log(JSON.stringify(detail));
        jsonlabels = [];
        datayellow = [];
        datagreen = [];
        datared = [];

        detail.forEach(function(data){
            jsonlabels.push(data['city']);
            datayellow.push(data['confirm']);
            datagreen.push(data['cured']);
            datared.push(data['death']);
        })

        /*console.log(jsonlabels);
        console.log(datayellow);
        console.log(datagreen);
        console.log(datared);*/
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'horizontalBar',

            // The data for our dataset
            data: {
                //labels: ['서울', '부산', '대구', '인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'],
                labels: jsonlabels,
                datasets: [{
                    label: '확진자',
                    borderColor: window.chartColors.yellow,
                    backgroundColor: window.chartColors.yellow,
                    //data: [66,80,2224,5,7,13,17,1,73,7,10,55,4,2,480,59,2]
                    data: datayellow
                },
                {
                    label: '완치',
                    borderColor: window.chartColors.green,
                    backgroundColor: window.chartColors.green,
                    //data: [11,0,4,1,2,0,0,0,8,0,0,0,1,1,0,0,0]
                    data: datagreen
                },
                {
                    label: '사망자',
                    borderColor: window.chartColors.red,
                    backgroundColor: window.chartColors.red,
                    //data: [0,0,8,0,0,0,0,0,1,0,0,0,0,0,8,0,0]
                    data: datared
                }]
            },

            // Configuration options go here
            options: {
                title:{
                    display:true,
                    text: ['확진자 : '+summary['total']+'  완치 : '+summary['cured']+'  사망자 : '+summary['death']+getCurrentTime()]
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                        }]
                }
            }  
        });
    });
        
function getCurrentTime(){
    var d = new Date();
    var week = ['일', '월', '화', '수', '목', '금', '토'];
    var currentDate = " ("+d.getFullYear() + "년 " + ( d.getMonth() + 1 ) + "월 " + d.getDate() + "일(" +week[d.getDate()]+") "+ d.getHours() + "시 기준)";
    //var currentTime = d.getHours() + "시 " + d.getMinutes() + "분 " + d.getSeconds() + "초"

    return currentDate;
}

function sortJson(element, prop, type, asc) {
    switch (type) {
        case "int":
            element = element.sort(function (a, b) {
                if (asc) {
                    return (parseInt(a[prop]) > parseInt(b[prop])) ? 1 : ((parseInt(a[prop]) < parseInt(b[prop])) ? -1 : 0);
                } else {
                    return (parseInt(b[prop]) > parseInt(a[prop])) ? 1 : ((parseInt(b[prop]) < parseInt(a[prop])) ? -1 : 0);
                }
            });
            break;
        default:
            element = element.sort(function (a, b) {
                if (asc) {
                    return (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : ((a[prop].toLowerCase() < b[prop].toLowerCase()) ? -1 : 0);
                } else {
                    return (b[prop].toLowerCase() > a[prop].toLowerCase()) ? 1 : ((b[prop].toLowerCase() < a[prop].toLowerCase()) ? -1 : 0);
                }
            });
    }
    return element;
}
