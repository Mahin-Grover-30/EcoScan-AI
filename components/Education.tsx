
import React, { useContext, useState } from 'react';
import Card from './common/Card';
import { UserContext } from '../App';

interface Lesson {
  id: number;
  title: string;
  content: string;
  points: number;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'The Power of Solar Energy',
    content: 'Solar panels convert sunlight into electricity, reducing our reliance on fossil fuels. A single hour of sunlight hitting the Earth contains more energy than the entire world consumes in a year!',
    points: 25,
  },
  {
    id: 2,
    title: 'Harnessing the Wind',
    content: 'Wind turbines use the kinetic energy of the wind to generate clean electricity. Modern turbines can power hundreds of homes and are a key part of the renewable energy mix.',
    points: 25,
  },
  {
    id: 3,
    title: 'Water Conservation 101',
    content: 'Simple actions like fixing leaks, taking shorter showers, and using water-efficient appliances can save thousands of liters of water each year. Every drop counts!',
    points: 25,
  },
   {
    id: 4,
    title: 'Understanding Your Plastics',
    content: 'Not all plastics are created equal. Look for the recycling symbol (a triangle of arrows) with a number inside. Numbers 1 (PET) and 2 (HDPE) are the most commonly recycled types.',
    points: 25,
  }
];

const Education: React.FC = () => {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const userContext = useContext(UserContext);

  const handleCompleteLesson = (lesson: Lesson) => {
    if (!completedLessons.includes(lesson.id) && userContext?.addHistory) {
      setCompletedLessons([...completedLessons, lesson.id]);
      
      // Add points and create a history item for the completed lesson
      userContext.addHistory({
          id: `lesson-${lesson.id}-${new Date().toISOString()}`,
          objectName: `Lesson: ${lesson.title}`,
          category: 'unknown', // Using 'unknown' category for non-scan items
          points: lesson.points,
          timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Learn & Earn</h1>
        <p className="text-secondary dark:text-gray-300 mt-2">Complete these quick lessons to earn bonus points and become an eco-expert.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col">
            <h2 className="text-xl font-bold text-primary mb-2">{lesson.title}</h2>
            <p className="text-secondary dark:text-gray-300 flex-grow">{lesson.content}</p>
            <button
              onClick={() => handleCompleteLesson(lesson)}
              disabled={completedLessons.includes(lesson.id)}
              className="mt-4 w-full bg-primary text-white font-bold py-2 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-primary-dark"
            >
              {completedLessons.includes(lesson.id) ? 'Completed!' : `Complete for ${lesson.points} points`}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Education;
