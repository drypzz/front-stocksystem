import React, { Component } from 'react';

import styles from './style.module.css';

class Countdown extends Component {
    constructor(props) {
        super(props);
        this.timerID = null;
        this.state = {
            timeLeft: this.calculateTimeLeft(),
        };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    calculateTimeLeft = () => {
        const { expirationTime } = this.props;
        const difference = +new Date(expirationTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                totalSeconds: Math.floor(difference / 1000),
            };
        } else {
            timeLeft = { minutes: 0, seconds: 0, totalSeconds: 0 };
        }
        return timeLeft;
    };

    tick = () => {
        const newTimeLeft = this.calculateTimeLeft();
        this.setState({ timeLeft: newTimeLeft });

        if (newTimeLeft.totalSeconds <= 0) {
            clearInterval(this.timerID);
            if (this.props.onExpire) {
                this.props.onExpire();
            }
        }
    };

    getStatusClass = () => {
        const { totalSeconds } = this.state.timeLeft;

        if (totalSeconds <= 60) {
            return styles.critical;
        }
        if (totalSeconds <= 300) {
            return styles.warning;
        }
        return styles.normal;
    };

    render() {
        const { timeLeft } = this.state;
        const formattedMinutes = String(timeLeft.minutes || 0).padStart(2, '0');
        const formattedSeconds = String(timeLeft.seconds || 0).padStart(2, '0');

        const countdownClasses = `${styles.countdown} ${this.getStatusClass()}`;

        return (
            <div className={countdownClasses}>
                <span>Expira em: </span>
                <strong>
                    {formattedMinutes}:{formattedSeconds}
                </strong>
            </div>
        );
    }
}

export default Countdown;