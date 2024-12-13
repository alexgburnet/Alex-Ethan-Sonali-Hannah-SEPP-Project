// Homepage.jsx
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal'; // Import react-modal if using the library

import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import Searchbar from "../../Components/Searchbar/Searchbar.jsx";
import ItemContainer from "../../Components/ItemContainer/ItemContainer.jsx";

import './Homepage.css';

function Homepage () {
    const [searchQuery, setSearchQuery] = useState('');
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const location = useLocation();

    useEffect(() => {
        // Parse query parameters
        const params = new URLSearchParams(location.search);
        const orderParam = params.get('order');

        if (orderParam) {
            // If 'order' parameter is present, set 'order_id' to its value
            Cookies.set('order_id', orderParam, { expires: 7 });
            console.log(`order_id set from URL parameter: ${orderParam}`);
        } else {
            // Check if order_id is already set in cookies
            let orderId = Cookies.get('order_id');
            if (!orderId) {
                // If not set, initialize it to -1 so the backend can generate a new one on add-to-basket
                Cookies.set('order_id', '-1', { expires: 7 }); // Expires in 7 days
                console.log('order_id was not found. Initialized to -1.');
            } else {
                console.log(`order_id found in cookies: ${orderId}`);
            }
        }

        // Check if user_id is set in cookies
        const userId = Cookies.get('user_id');
        if (!userId) {
            setShowUsernameModal(true);
        }
    }, [location.search]);

    const handleSearch = (query) => {
        console.log(`Search query: ${query}`);
        setSearchQuery(query);
    }

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (username.trim() === '') {
            setUsernameError('Username cannot be empty.');
            return;
        }

        // Optionally, add more validation here (e.g., allowed characters, length)

        // Set the user_id cookie
        Cookies.set('user_id', username.trim(), { expires: 7 }); // Expires in 7 days
        console.log(`user_id set to: ${username.trim()}`);

        // Close the modal
        setShowUsernameModal(false);
    }

    return (
        <div className="homepage">
            <Sidebar />
            <div className="items-search">
                <Searchbar onSearch={handleSearch}/>
                <ItemContainer searchQuery={searchQuery}/>
            </div>

            {/* Username Modal */}
            <Modal
                isOpen={showUsernameModal}
                onRequestClose={() => {}}
                contentLabel="Enter Username"
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '300px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                <h2>Welcome!</h2>
                <p>Please enter your username to continue.</p>
                <p>This can be anything, as this is handled by ssh</p>
                <p>Remember, this will be stored in cookies!</p>
                <form onSubmit={handleUsernameSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (usernameError) setUsernameError('');
                        }}
                        placeholder="Enter username"
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                    {usernameError && <p style={{ color: 'red', marginBottom: '10px' }}>{usernameError}</p>}
                    <button type="submit" style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}>
                        Submit
                    </button>
                </form>
            </Modal>
        </div>
    );
}

export default Homepage;