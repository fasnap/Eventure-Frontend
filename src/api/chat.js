import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../instance/axiosInstance";

export const fetchChatRooms=createAsyncThunk(
    'chat/fetchChatRooms',
    async (_, { rejectWithValue })=>{
        try {
            const response = await axiosInstance.get('/chat/list');
            return response.data; 
        } catch (error){
            return rejectWithValue(error.response?.data);
        }
    }
)

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (roomId, { rejectWithValue })=>{
        try {
            const response = await axiosInstance.get(`/chat/${roomId}/messages/`);
            return { roomId, messages: response.data };
        } catch (error){
            return rejectWithValue(error.response?.data);
        }
    }
)

export const createOrGetChatRoom = createAsyncThunk(
    'chat/createOrGetChatRoom',
    async ({ attendeeId, creatorId }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/chat/create/', {
          attendee_id: attendeeId,
          creator_id: creatorId,
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data);
      }
    }
  );
  