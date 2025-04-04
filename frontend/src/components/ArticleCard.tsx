// Ensure this file exists and contains the ArticleCard component

interface ArticleCardProps {
    id: number; // Added id property
    title: string;
    summary: string;
    onSave: () => void;
    onViewDetails: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, summary, onSave, onViewDetails }) => {
    return (
        <div>
            <h2>{title}</h2>
            <p>{summary}</p>
            <button onClick={onSave}>Save</button>
            <button onClick={onViewDetails}>View Details</button>
        </div>
    );
};

export default ArticleCard;