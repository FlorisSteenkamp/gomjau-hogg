import * as React from 'react';
import { Library, Pencil } from 'lucide-react';
import { Link, useSearch } from 'wouter';
import { List } from '../preshape/List/List.js';
import { ListItem } from '../preshape/List/ListItem.js';


function Menu() {
    const searchParamsStr = useSearch();
    
    return (
        <List gap="x2">
            <Link to={`/?${searchParamsStr}`}>
                <ListItem  style={{ color: 'white' }}>
                    <Pencil size={"1.25rem"} />
                </ListItem>
            </Link>

            <Link to={`/library?${searchParamsStr}`}>
                <ListItem style={{ color: 'white' }}>
                    <Library size={"1.25rem"} />
                </ListItem>
            </Link>
        </List>
    );
}


export { Menu }




{/* <Route path="/library" element={
    // { ({ match }) => (
    <ListItem separator="|">
        <Link active={ !!match } title="Library" to={ `/library?${search}` }>
        {<Tooltip content="Library">
            { (props) => <Icon { ...props } name="Book" size="1.25rem" /> }
        </Tooltip>}
        </Link>
    </ListItem>
    // ) }
}/> */}