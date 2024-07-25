import { useContext, useEffect, useState } from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({place}){
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name,setName] = useState('');
    const [mobile, setMobile]= useState('');
    const [redirect,setRedirect]=useState('');
    const {user} = useContext(UserContext);
    let numberOfDays = 0;

    useEffect(()=>{
        if(user){
            setName(user.name);
        }
    },[user]);
    if(checkIn && checkOut){
        numberOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace(){
        const response = await axios.post( '/bookings', {checkIn, checkOut, 
            numberOfGuests, name, mobile, price:numberOfDays*place.price, 
            place:place._id,});
        const bookingId = response.data._id;
        setRedirect('/account/bookings/'+bookingId);
    }

    if(redirect){
        return <Navigate to={redirect}/>
    }

   
    return (
        <div className="bg-white shadow p-4 rounded-2xl mt-4">
            <div className="text-2xl text-center">
                Price: Rs.{place.price} /night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-1 px-2">
                        <label>Check-in:</label>
                        <input type="date" value={checkIn} onChange={ev => setCheckIn(ev.target.value)}/>
                    </div>

                    <div className="py-1 px-2 border-l">
                        <label>Check-out:</label>
                        <input type="date" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} />
                    </div>
                </div>

                <div className="py-3 px-4 border-t">
                    <label>Number of guests:</label>
                    <input type="number" value={numberOfGuests} onChange={ev => setNumberOfGuests(ev.target.value)}/>
                </div>
                {numberOfDays > 0 && (
                    <div className="py-3 px-4 border-t">
                        <label>Your Name:</label>
                        <input type="text" value={name} onChange={ev => setName(ev.target.value)} />
                        <label>Your Contact:</label>
                        <input type="tel" value={mobile} onChange={ev => setMobile(ev.target.value)} />
                    </div>
                )}
            </div>
            <button onClick={bookThisPlace} className="primary mt-4">
                Book This Place 
                {numberOfDays > 0 && (
                    <span> 
                        at Rs. {numberOfDays * place.price}
                    </span>
                )}
                </button>
        </div>
    );
}  