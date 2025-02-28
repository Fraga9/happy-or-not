export default function FeedbackButton({ icon, color, onClick }) {
    return (
      <button className="feedback-button" style={{ color }} onClick={onClick}>
        {icon}
      </button>
    );
  }
  