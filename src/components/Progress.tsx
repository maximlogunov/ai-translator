interface ProgressProps {
  progress: number;
  text: string;
}

export const Progress: React.FC<ProgressProps> = ({ progress = 0, text }) => {
  return (
    <div className="progress-container">
      <div className='progress-bar' style={{ 'width': `${progress}%` }}>{text} ({`${progress.toFixed(2)}%`})</div>
    </div>
  );
};