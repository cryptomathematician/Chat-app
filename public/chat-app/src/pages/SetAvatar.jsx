import React,{useEffect, useState} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import loader from '../assets/loader.gif';
import toast, {Toaster} from 'react-hot-toast';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes';
import {Buffer} from 'buffer'


function SetAvatar() {
    const api = "https://api.multiAvatar.com/45678945";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      position: 'bottom-right',
      icon: '❎',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    }
    useEffect(()=>{
      if(!localStorage.getItem('chat-app-user')){
        navigate('/login');
      }
    }, []);
    const setProfilePicture = async () => {
      if(selectedAvatar=== undefined){
        toast("Please select an avatar", toastOptions)
      } else {
        const user = await JSON.parse(localStorage.getItem("chat-app-user"));
        const {data}= await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[setSelectedAvatar],
        });

        if(data.isSet){
          user.isAvatarImageSet= true;
          user.avatarImage = true;
          localStorage.setItem('chat-app-user', JSON.stringify(user));
          navigate('/')
        } else{
          toast('Error setting avatar.Please try again', toastOptions)
        }
      }
    };
    useEffect(()=>{
    const fetchAvatars= async ()=> {
     try{
        const data = [];
        for(let i=0; i<4; i++ ){
          const image = await axios.get(
            `${api}/${Math.round(Math.random()* 1000)}`
          );
          const buffer = new Buffer(image.data);
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
        setIsLoading(false);
      } catch(error) {
        console.error("Failed to fetch avatars:", error);
        toast("Failed to load avatars. Please try again later.", toastOptions);
      }
    };
    fetchAvatars();
  }, []);
  
    
  return (
    <>
    {
      isLoading?  <Container>
        <img src={loader} alt="loader" className='loader'/>
      </Container>:(
         <Container>
         <div className="title-container">
             <h1>Pick an avatar as your profile picture</h1>
         </div>
         <div className="avatars">
             {
               avatars.map((avatar, index) => {
                 return (
                   <div
                     key= {index}
                     className={`avatar ${selectedAvatar === index? "selected":"" }`}>
                       <img src={`data:image/svg+xml;base64,${avatar}`} 
                       alt='avatar'
                       onClick ={()=>setSelectedAvatar(index)}
                       />
                   </div>
                 )
               })
             }
         </div>
         <button className="submit-btn" onClick={setProfilePicture}>
           Set as Profile Picture
         </button>
      </Container> 
      )
      }  
      <Toaster/>
    </>
  )
}


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
  gap: 3 rem;
  background-color: #131324;
  height:100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container{
    h1{
      color: white;
    }
  }
  .avatars{
    display: flex;
    gap: 2rem;
    .avatar{
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      align-items:center;
      display:flex;
      justify-content: center;
      transition: 0.5s ease-in-out;
      img{
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff
    }
  }
  .submit-btn{
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 0.4rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover{
        background-color: #4e0eff;
    }
  }
`;


export default SetAvatar
