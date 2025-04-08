import {Bar} from "react-chartjs-2"
import {useNavigate} from "react-router-dom";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {Reservation} from "../types/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart( { reservations, filterDate = new Date(), yearView = false, countView = false }: { reservations: Reservation[], filterDate: Date, yearView: boolean, countView: boolean }) {

    const generateChartDataByMonth = (filteredReservations: Reservation[]) => {
        const values = new Array(31).fill(0);

        if (!countView) {
            for (const reservation of filteredReservations) {
                const day = new Date(reservation.date).getDate();
                values[day - 1] += 1;
            }
        } else {
            for (const reservation of filteredReservations) {
                const day = new Date(reservation.date).getDate();
                values[day - 1] += reservation.count;
            }
        }

        return {
            labels: Array.from({length: 31}, (_, i) => (i + 1).toString() + "." + (filterDate.getMonth() + 1).toString()),
            datasets: [
                {
                    label: countView && "Personen" || !countView && "Reservierungen",
                    data: values,
                    backgroundColor: countView && "rgb(195,0,239)" || !countView && "rgb(45,126,246)",
                    borderColor: "rgba(0, 0, 0, 1)",
                    borderWidth: 2
                }
            ]
        };
    }

    const generateChartDataByYear = (filteredReservations: Reservation[]) => {
        const values = new Array(12).fill(0);

        if (!countView) {
            for (const reservation of filteredReservations) {
                const month = new Date(reservation.date).getMonth();
                values[month] += 1;
            }
        } else {
            for (const reservation of filteredReservations) {
                const month = new Date(reservation.date).getMonth();
                values[month] += reservation.count;
            }
        }

        return {
            labels: [
                'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
            ],

            datasets: [
                {
                    label: countView && "Personen" || !countView && "Reservierungen",
                    data: values,
                    backgroundColor: countView && "rgb(51,239,0)" || !countView && "rgba(13, 110, 253, 1)",
                    borderColor: "rgba(0, 0, 0, 1)",
                    borderWidth: 2
                }
            ]
        };
    }

    const chartData = yearView ? generateChartDataByYear(reservations) : generateChartDataByMonth(reservations);
    const maxDataValue = Math.max(...chartData.datasets[0].data);

    const navigate = useNavigate();

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                onClick: null
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: maxDataValue ? Math.ceil(maxDataValue * 1.2) : 10,
                ticks: {
                    stepSize: 1,
                }
            },
        },
        onClick: (event, elements) => {
            if (elements.length >= 0 && !yearView) {
                const index = elements[0].index;
                navigate(`/all?year=${filterDate.getFullYear()}&month=${filterDate.getMonth() + 1}&day=${index + 1}`);
            }
        }
    };

    return (
        <>
            <Bar data={chartData} options={options} height={100} />
        </>
    )
}

export default BarChart;