
import React from 'react';
import Layout from '../../components/Layout';
import MediaContact from '../../models/MediaContact';
import ContactsTable from './ContactsTable';
import { useState, useEffect } from 'react';
import CreateContactButton from './CreateContactButton';
import CreateContactDrawer from './CreateContactDrawer';
//import { AuthenticationContext } from '../../App';
//import React from 'react';
// import MediaContact from '../../models/mediaContact';

//import {
//    FolderRegular,
//    EditRegular,
//    OpenRegular,
//    DocumentRegular,
//    PeopleRegular,
//    DocumentPdfRegular,
//    VideoRegular,
//} from "@fluentui/react-icons";


const MediaContacts = () => {
    const [contacts, setContacts] = useState<any[]>([]);


    const fetchContacts = async () => {
        const response = await fetch('mediacontacts');
        const data = await response.json();
        //console.log(JSON.stringify(data));
        const contacts: any[] = data as any[];
        console.log(JSON.stringify(contacts[0]));
        setContacts(contacts);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div>
            <Layout title={"Media Contacts"} selectedNavItem={"3"} headingButton={<CreateContactButton />} >
                <ContactsTable items={contacts} />
            </Layout>
        </div>
    );
}


export default MediaContacts;

