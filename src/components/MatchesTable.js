// MatchesGrid.js
import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-grids';

const MatchesGrid = ({ matches }) => {
  return (
    <GridComponent dataSource={matches} allowPaging={true} pageSettings={{ pageSize: 10 }}>
      <ColumnsDirective>
        <ColumnDirective field='name' headerText='Name' />
        <ColumnDirective field='age' headerText='Age' />
        <ColumnDirective field='msisdn' headerText='MSISDN' />
      </ColumnsDirective>
    </GridComponent>
  );
};

export default MatchesGrid;
