
import React from 'react';

const ContractStatus = ({ status }) => (
    <div>
        <h2>Contract Status</h2>
        <p><strong>Payer Approved:</strong> {status.payerApproved ? 'Yes' : 'No'}</p>
        <p><strong>Payee Approved:</strong> {status.payeeApproved ? 'Yes' : 'No'}</p>
        <p><strong>Contract Canceled:</strong> {status.contractCanceled ? 'Yes' : 'No'}</p>
        <p><strong>Current Milestone:</strong> {status.currentMilestone}</p>
    </div>
);

export default ContractStatus;
