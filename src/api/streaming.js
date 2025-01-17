import { createAsyncThunk } from "@reduxjs/toolkit";
import { EVENT_BASE_URL } from "./base";
import axios from "axios";

export const joinStreamingRoom = createAsyncThunk(
    'streaming/joinRoom',
    async({eventId, token})=>{
        console.log("event id in api", eventId);
        const response = await axios.post(`${EVENT_BASE_URL}${eventId}/stream/`,{},{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log("reposne is ", response.data)
        return response.data;
    }
)