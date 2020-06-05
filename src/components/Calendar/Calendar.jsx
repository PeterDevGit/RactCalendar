import React, {Component} from "react";

import './Calendar.css';
import {connect} from "react-redux";

import {bindActionCreators} from "redux";
import {getWeeksData} from "../actions";


class Calendar extends Component{

    constructor(params) {
        super(params);

        this.state = {
                daysData: {},
                scheduleSheet: [],
                weekDays: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
        };

        this.selection = [];
    }

    componentDidMount() {
        const { actions: { getWeeksData } } = this.props;
        getWeeksData()
        this.setState({
            scheduleSheet: this.initSchedulerTable(0)
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(JSON.stringify(prevProps.weeksData) !== JSON.stringify(this.props.weeksData)){
            this.setState({
                    daysData: this.props.weeksData
            });
            this.unpackConfig(this.props.weeksData);
        }
    }

    /*TODO разбираем обьект с state*/
    unpackConfig = (config) => {
        const { scheduleSheet } = this.state;

        if(scheduleSheet.length > 0){
            const { daysData, weekDays } = this.state;
            let dayTitle = weekDays;
            let dayNum = 0;
            let newFormat = this.state.scheduleSheet.concat();

            for (let day of Object.keys(config)) {
                const dayConfigs = config[day];
                if (dayConfigs.length > 0) {
                    for (let dayConfig of dayConfigs) {
                        const {bt, et} = dayConfig;

                        if (bt && et) {
                            if (typeof daysData[dayTitle[dayNum]] === 'undefined') {
                                daysData[dayTitle[dayNum]] = [];
                            }
                            for (let i = Math.ceil(bt / 60); i < Math.ceil(et / 60); i++) {
                                newFormat[dayNum][i] = 1;
                            }
                        }
                    }
                }
                dayNum++;
            }
            this.setState({ scheduleSheet: newFormat})
        }
    }

    /*TODO Генерируем данные ячеек*/
    initSchedulerTable(value) {
        let scheduleSheet = [];

        for (let day = 0; day < 7; day++) {
            scheduleSheet.push([]);
            for (let hour = 0; hour < 24; hour++) {
                scheduleSheet[day].push(value);
            }
        }
            return scheduleSheet;
    }

    /*TODO Нажатие на ячейку*/
    clickHourItem(day, hour, action) {

        const {scheduleSheet, daysData, weekDays} = this.state;

        this.selection.push([day, hour]);
        scheduleSheet[day][hour] = 1;

        if (action === 'end') {
            for (let i = this.selection[0][0]; i <= this.selection[1][0]; i++) {
                for (let j = 0; j < 24; j++) {
                    if ((i === this.selection[0][0] && j < this.selection[0][1]) || (i === this.selection[1][0] && j > this.selection[1][1])) {
                        continue;
                    }
                    scheduleSheet[i][j] = 1;
                }
            }

            if (typeof daysData[weekDays[day]] === 'undefined') {
                daysData[weekDays[day]] = [];
            }

            daysData[weekDays[day]].push({
                bt: this.selection[0][1] * 60,
                et: (this.selection[1][1] + 1) * 60 - 1,
            });
            this.selection = [];
        }

        this.setState(this.state);
    }

    /*TODO Кнопка CLEAR*/
    clearSheet() {
        this.setState({
            daysData : {},
            scheduleSheet: this.initSchedulerTable(0)
        });
        this.selection = [];
    }

    /*TODO Кнопка SAVE CHANGES*/
    saveChanges() {
        const { daysData } = this.state;
        console.log('Configuration object: ', daysData);
    }


    render() {
        const { weekDays, scheduleSheet } = this.state;
        return(
            <div className="main-wrapper">
                <div className="calendar-wrapper">
                  <span className="header-text-calendar">
                        <span className="day-header-text">ALL DAY</span>
                            <span className="header-time-interval">
                                <span>00:00</span>
                                <span>03:00</span>
                                <span>06:00</span>
                                <span>09:00</span>
                                <span>12:00</span>
                                <span>15:00</span>
                                <span>18:00</span>
                                <span>21:00</span>
                            </span>
                    </span>

                    <div className="calendar-content">
                        {
                            scheduleSheet.map( (day, dayKey) => {
                                return (
                                    <div className="day-row" key={dayKey}>
                                        <span className="day-block">{weekDays[dayKey]}</span>
                                        <span className="block-day-all"/>

                                        <span className="hour-block">
                                            <span className="hour-three-item">
                                                { day.map( (selected, hourKey) => {
                                                    return(
                                                            <span
                                                                key={dayKey + hourKey}
                                                                className={'one-hour-item'.concat(selected ? ' active' : '')}
                                                                onMouseDown={this.clickHourItem.bind(this, dayKey, hourKey, 'start')}
                                                                onMouseUp={this.clickHourItem.bind(this, dayKey, hourKey, 'end')}
                                                            >
                                                            </span>
                                                            )
                                                        }
                                                    )
                                                }
                                            </span>
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="btn-block">
                        <button className="btn btn-primary" onClick={this.clearSheet.bind(this)}>
                            Clear
                        </button>

                        <button className="btn btn-primary" onClick={this.saveChanges.bind(this)}>
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

/*TODO props с сайла reducer.js*/
const mapStateToProps = (state) => {
    return {
        weeksData: state.weeksData
    };
};

/*TODO function с сайла action.js*/
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        getWeeksData
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
