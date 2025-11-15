import React, { useContext } from 'react';
import { UserContext } from '../App';
import Card from './common/Card';
import { WASTE_CATEGORIES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HistoryItem } from '../types';

const HistoryListItem: React.FC<{ item: HistoryItem }> = ({ item }) => {
    const categoryDetails = WASTE_CATEGORIES[item.category] || WASTE_CATEGORIES.unknown;
    const IconComponent = categoryDetails.icon;

    return (
        <li className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
                <div className={`p-2 rounded-full bg-${categoryDetails.color}/20 mr-4`}>
                    <IconComponent className={`w-6 h-6 text-${categoryDetails.color}`} />
                </div>
                <div>
                    <p className="font-semibold">{item.objectName}</p>
                    <p className="text-sm text-secondary dark:text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</p>
                </div>
            </div>
            <span className={`font-bold text-primary`}>+{item.points} pts</span>
        </li>
    );
};

// Define level thresholds - the points needed to reach each level.
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 5000];

const LevelProgress: React.FC<{ points: number }> = ({ points }) => {
    const currentLevel = LEVEL_THRESHOLDS.filter(threshold => points >= threshold).length;
    const pointsForCurrentLevel = LEVEL_THRESHOLDS[currentLevel - 1];
    const pointsForNextLevel = LEVEL_THRESHOLDS[currentLevel] || points;

    const progressPercentage = pointsForNextLevel > pointsForCurrentLevel
        ? ((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100
        : 100;

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">Level Progress</h2>
            <div className="flex justify-between items-baseline mb-2">
                <span className="font-bold text-primary text-2xl">Level {currentLevel}</span>
                <span className="text-sm text-secondary dark:text-gray-400">
                    {points - pointsForCurrentLevel} / {pointsForNextLevel - pointsForCurrentLevel} to next level
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                    className="bg-primary h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </Card>
    );
};


const Dashboard: React.FC = () => {
    const userContext = useContext(UserContext);

    if (!userContext || !userContext.user) {
        return <div className="text-center p-8">Please log in to see your dashboard.</div>;
    }
    
    const { user } = userContext;
    
    const chartData = Object.keys(WASTE_CATEGORIES)
    .filter(cat => cat !== 'unknown')
    .map(category => ({
        name: WASTE_CATEGORIES[category as keyof typeof WASTE_CATEGORIES].label,
        count: user.history.filter(item => item.category === category).length,
    })).filter(d => d.count > 0);

    const totalScans = user.history.length;
    // Mock data for other stats
    const co2Saved = user.history.length * 1.2; // mock calculation
    const waterSaved = user.history.length * 5.5; // mock calculation

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
            
            <LevelProgress points={user.points} />

            <Card>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-3xl font-bold text-primary">{user.points}</p>
                        <p className="text-sm text-secondary">Total Points</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-primary">{totalScans}</p>
                        <p className="text-sm text-secondary">Items Logged</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-primary">{co2Saved.toFixed(1)} kg</p>
                        <p className="text-sm text-secondary">CO₂ Saved</p>
                    </div>
                     <div>
                        <p className="text-3xl font-bold text-primary">{waterSaved.toFixed(1)} L</p>
                        <p className="text-sm text-secondary">Water Saved</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <h2 className="text-xl font-bold mb-4">Activity History</h2>
                    {user.history.length > 0 ? (
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        {user.history.map(item => <HistoryListItem key={item.id} item={item} />)}
                    </ul>
                    ) : (
                        <p className="text-secondary text-center py-8">No activity yet. Scan an item or complete a lesson!</p>
                    )}
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4">Recycling Breakdown</h2>
                     {chartData.length > 0 ? (
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip cursor={{fill: 'rgba(52, 211, 153, 0.1)'}} contentStyle={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '0.5rem' }}/>
                                <Bar dataKey="count" fill="#34d399" name="Items" />
                            </BarChart>
                        </ResponsiveContainer>
                     ) : (
                         <p className="text-secondary text-center py-8">Scan items to see your recycling statistics.</p>
                     )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;