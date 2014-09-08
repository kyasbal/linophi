
    declare class Chart
    {
        constructor(context:any);

        Radar(data:any,options:any);

        Doughnut(doughnutData: { value;color: string;label: string }[], p: { animateScale: boolean });
    }
