import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ArticleCardProps {
    id: number;
    title: React.ReactNode;
    summary: string;
    onSave: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ id, title, summary, onSave }) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const handleSave = () => {
        if (!isAuthenticated) {
            alert('You must be logged in to save articles.');
            return;
        }
        onSave();
    };

    return (
        <div>
            <h3>{title}</h3>
            <p>{summary}</p>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default ArticleCard;