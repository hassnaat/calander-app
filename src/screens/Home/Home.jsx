import React, { useState, useEffect } from 'react';
import "./Home.css"
import Calendar from 'react-calendar';
import axios from "axios"
const Home = () => {
    const [date, setDate] = useState(new Date());
    const [response, setResponse] = useState({
        data: [],
        error: null,
        loading: null
    });
    const [reqDate, setReqDate] = useState({
        day: "",
        month: "",
        year: ""
    });
    const [selectedDate, setSelectedDate] = useState({
        day: "",
        month: "",
        year: ""
    });
    const getSelectedDate = () => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        setSelectedDate({
            day,
            month,
            year
        })
    }
    const nextDate = () => {
        const d = new Date(date);
        const nxt = new Date(date);
        nxt.setDate(d.getDate() + 1);
        const day = nxt.getDate();
        const month = nxt.getMonth() + 1;
        const year = nxt.getFullYear();
        setReqDate({
            day,
            month,
            year
        })
    }
    const getPersons = async (current) => {
        setResponse((val) => {
            return {
                ...val,
                loading: "Loading"
            }
        })
        try {
            const { data } = await axios(`https://history.muffinlabs.com/date/${current ? "1" : reqDate.month}/${current ? "2" : reqDate.day}`)
            setResponse((val) => {
                return {
                    loading: null,
                    error: null,
                    data: data.data
                }
            })
        } catch (error) {
            setResponse((val) => {
                return {
                    ...val,
                    loading: null,
                    error: "Something went wrong"
                }
            })
        }
    }
    useEffect(() => {
        getSelectedDate(date)
        nextDate(date)
    }, [date])
    useEffect(() => {
        getPersons(true)
    }, [])
    return (
        <div className='calendar__container'>
            <Calendar onChange={setDate} value={date} />
            <p>Selected Date:  {`${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`}</p>
            <p>Next Date: {`${reqDate.day}/${reqDate.month}/${reqDate.year}`}</p>
            <button onClick={() => getPersons(false)}>Submit</button>
            <div className='persons__list'>
                <div className='persons__listheading'>
                    <div className='persons__name'>People</div>
                    <div className='birth__year'>Birth Year</div>
                </div>
                {
                    response.loading ? <div className='exception__text'>Loading...</div> :
                        response.error ? <div className='exception__text'>{response.error}</div> :
                            response.data.Births?.length > 0 ? response.data.Births.map(item => {
                                return (<div className='persons__listitem'>
                                    <div className='persons__name'>{item.text}</div>
                                    <div className='birth__year'>{item.year}</div>
                                </div>)
                            }) : <div className='exception__text'>No Data available for this date</div>}
            </div>
        </div>

    )
}

export default Home
