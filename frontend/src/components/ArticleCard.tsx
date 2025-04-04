// Ensure this file exists and contains the ArticleCard component
import React from "react";

interface ArticleCardProps {
    id: number; // Added id property
    title: React.ReactNode;
    summary: string;
    onSave: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, summary, onSave }) => {
    return (
        <div>
            <h2>{title}</h2>
            <p>{summary}</p>
            <button onClick={onSave}>Save</button>
        </div>
    );
};

export default ArticleCard;