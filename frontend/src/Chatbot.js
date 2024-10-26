import React, { useEffect, useState } from 'react';

const Chatbot = () => {
    const [news, setNews] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    const fetchNews = async () => {
        try {
            // Replace with your backend news API endpoint
            const response = await fetch('http://localhost:5000/api/news'); // Adjust the endpoint as necessary
            const data = await response.json();
            setNews(data.articles); // Adjust based on your API structure
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        if (news.length > 0) {
            const newsMessage = {
                type: 'news',
                content: 'Here are the latest news updates:',
                articles: news.map(article => ({ title: article.title, url: article.url })),
            };
            setChatMessages(prevMessages => [...prevMessages, newsMessage]);
        }
    }, [news]);

    return (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-white border rounded shadow-lg w-80 p-4 z-10">
            <h3 className="font-bold mb-2">Latest News</h3>
            <div className="h-60 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        {msg.type === 'news' ? (
                            <div>
                                <strong>{msg.content}</strong>
                                <ul>
                                    {msg.articles.map((article, i) => (
                                        <li key={i}>
                                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                                {article.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>{msg.content}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chatbot;
