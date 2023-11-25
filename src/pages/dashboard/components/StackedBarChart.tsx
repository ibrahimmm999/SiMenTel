import Chart from "react-apexcharts";

type dataChart = {
  name: string;
  data: number[]; // Replace 'any' with the specific type of 'dataRealisasi' if known
  color: string;
};

interface StackedBarChartProps {
  category: string[];
  data: dataChart[];
}

function StackedbarChart({ data, category }: StackedBarChartProps) {
  return (
    <>
      <div className="container-fluid">
        <Chart
          type="bar"
          width={"100%"}
          height={75}
          series={data}
          options={{
            chart: {
              stacked: true,
              stackType: "100%",
              width: '100%',
              height: '100%',
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false
              }
            },
            plotOptions: {
              bar: {
                horizontal: true,
                columnWidth: "100%",
                barHeight: "100%"
              },
            },
            stroke: {
              width: 1,
            },
            xaxis: {
              labels: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              crosshairs: {
                show: false,
              },
              tooltip: {
                enabled: false,
              },
              categories: category
            },
            yaxis: {
              show: false,
              labels: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              crosshairs: {
                show: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            legend: {
                show: false
            },
            // responsive: [{
            //     breakpoint: 1000,
            //     options: {
            //         plotOptions: {
            //             bar: {
            //                 horizontal: true
            //             }
            //         },
            //         legend: {
            //             position: "bottom"
            //         }
            //     }
            // }],
            dataLabels: {
              enabled: true,
            //   formatter: function(val) {
            //     return val+"%"
            //   },
            },
            grid: {
              show: false,
            },
          }}
        />
      </div>
    </>
  );
}

export default StackedbarChart;
