'use client';

import GroupDetail from './GroupDetail';

const GroupDetailPage = ({ params }) => {
    const { groupId } = params;
    return <GroupDetail groupId={groupId} />;
}

export default GroupDetailPage;
