import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ArticleCardProps {
    id: number;
    title: React.ReactNode;
    summary: string;
    onSave: () => void;
    buttonLabel?: string; // Add optional buttonLabel prop
}

const ArticleCard: React.FC<ArticleCardProps> = ({ id, title, summary, onSave, buttonLabel = "Save" }) => {
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
            <button onClick={handleSave}>{buttonLabel}</button> {/* Use buttonLabel for the button text */}
        </div>
    );
};

export default ArticleCard;