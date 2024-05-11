import * as React from 'react';
import { Link, useSearch } from 'wouter';
import { List } from '../preshape/List/List';
import { ListItem } from '../preshape/List/ListItem';
import { Library, Pencil } from 'lucide-react';


function Menu() {
    const searchParamsStr = useSearch();
    
    return (
        <List gap="x2">
            <Link to={`/gomjau-hogg/?${searchParamsStr}`}>
                <ListItem  style={{ color: 'white' }}>
                    <Pencil size={"1.25rem"} />
                </ListItem>
            </Link>

            <Link to={`/gomjau-hogg/library?${searchParamsStr}`}>
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