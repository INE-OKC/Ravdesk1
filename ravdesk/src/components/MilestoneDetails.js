
import React, { useState, useEffect } from 'react';

const MilestoneDetails = ({ contract }) => {
    const [milestones, setMilestones] = useState([]);

    const loadMilestones = async () => {
        if (contract) {
            const [percentages, count, current] = await contract.methods.getMilestoneDetails().call();
            setMilestones(percentages.map((p, i) => ({ id: i + 1, percentage: p })));
        }
    };

    useEffect(() => {
        loadMilestones();
    }, [contract]);

    return (
        <div>
            <h2>Milestone Details</h2>
            <ul>
                {milestones.map((milestone) => (
                    <li key={milestone.id}>
                        Milestone {milestone.id}: {milestone.percentage}%
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MilestoneDetails;
