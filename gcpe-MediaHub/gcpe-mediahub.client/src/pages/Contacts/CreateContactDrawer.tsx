import * as React from "react";
import {
    DrawerBody,
    DrawerHeader,
    DrawerHeaderTitle,
    OverlayDrawer,
    Button,
    useRestoreFocusSource,
    useRestoreFocusTarget,
    Field,
    Input,
    Checkbox,
    makeStyles,
    Divider,
    Title3,
    Dropdown,
    Option,
    Card,
    Body2,
    Toaster,
    useToastController,
    Toast,
    ToastTitle,
    ToastBody,
    ToastFooter,
    ToastIntent,
    Link,
} from "@fluentui/react-components";

import { Dismiss24Regular, Add24Regular, Add16Regular } from "@fluentui/react-icons";
import SocialMediaInput from "./SocialMediaInput";
import { useEffect, useRef, useState } from "react";
import MediaOutletInput from "./MediaOutletInput";
import MediaContact from "../../models/mediaContact";
import MediaOutlet from "../../models/mediaOutlet";
import { OutletAssociation } from "../../models/OutletAssociation";
import { SocialMediaCompany } from "../../models/SocialMediaCompany";
import { SocialMediaLink } from "../../models/SocialMediaLink";
import { PhoneNumber } from "../../models/PhoneNumber";
import { JobTitle } from "../../models/JobTitle";
import { useId } from "react";
import { contactService } from "../../services/contactService";
import { OutletService } from "../../services/OutletService";


const useStyles = makeStyles({
    drawer: {
        width: "650px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        fontSize: "16px",
        gap: "Global.Size.20",
        '& div': {
            marginBottom: "10px",
        },
    },
    title: {
        fontSize: "var(--Font - size - 500, 20px)",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "var(--Line - height - 500, 28px)",
    },
    formGroup: {
        display: "inline-flex",
    },
    addButton: {
        float: "right",
    },
    outletsSection: {
        border: "1px solid #ccc!important",
        borderRadius: "4px",
        padding: "8px",
        marginBottom: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "Global.Size.80",
        alignSelf: "stretch",
    },
    maxWidth: {
        width: "100%",
    },
    saveCancelButtons: {
        marginTop: "20px",
        '& Button': {
            marginRight: "8px",
        },
    },
    sectionHeader: {
        fontSize: '16px',
        fontWeight: '400',
    },
}
);

interface CreateContactProps {
    updateList: () => void,
    socials: SocialMediaCompany[];
    startOpen: boolean;
}

export const CreateContactDrawer: React.FC<CreateContactProps> = ({ updateList, socials, startOpen }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const [socialMediaLinks, setSocialMediaLinks] = useState([
        { typeName: '', url: '', companyId: '' }
    ]);

    useEffect(() => {
        setIsOpen(startOpen);
    },[startOpen]);

    const [error, setError] = React.useState<string | null>(null);
    const [outletErrors, setOutletErrors] = useState<any[]>([]);
    const [showValidation, setShowValidation] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState({
        firstName: '',
        lastName: '',
        email: '', //TODO: more sophisticated. check for '@', etc.
        atLeastOnePhoneNumber: '', // at least one personal phone number (not on Outlet association)
        atLeastOneWorkplace: '',
        workplaceEmail: '',
    });

    // for tracking social media link inputs


    const [socialMediaInputs, setSocialMediaInputs] = useState<number[]>([1]);
    const [socialMedias, setSocialMedias] = useState<SocialMediaCompany[]>([]); //Todo: actual model, not 'any'
    const addSocialMediaInput = () => {
        setSocialMediaInputs([...socialMediaInputs, socialMediaInputs.length]);
    };
    const removeSocialMediaInput = (index: number) => {
        setSocialMediaInputs(socialMediaInputs.filter((_, i) => i !== index));
    };
    const handleSocialMediaDataChange = (index: number, data: any) => {
        const newSocialMedia = [...socialMedias];
        newSocialMedia[index] = data; // Update the specific index
        setSocialMedias(newSocialMedia);
    };
    // end of social media link tracking
    const [website, setWebsite] = useState<string>('');
    // for tracking outlet inputs
    const [outletInputs, setOutletInputs] = useState<number[]>([1]);
    const [outletAssociations, setOutletAssociations] = useState<OutletAssociation[]>([]);

    /* const outletInputRefs = useRef<React.RefObject<MediaOutletInputRef>[]>([]);*/
    const addOutletInput = () => {
        setOutletInputs([...outletInputs, outletInputs.length]);

        /*   outletInputRefs.current.push(React.createRef<MediaOutletInputRef>());*/
    };
    const removeOutletInput = (index: number) => {
        setOutletInputs(outletInputs.filter((_, i) => i !== index));
        setOutletAssociations(outletAssociations.filter((_, i) => i !== index));
    };
    // end of outlet tracking



    const styles = useStyles();
    // all Drawers need manual focus restoration attributes
    // unless (as in the case of some inline drawers, you do not want automatic focus restoration)
    const restoreFocusTargetAttributes = useRestoreFocusTarget();
    const restoreFocusSourceAttributes = useRestoreFocusSource();


    // contact fields
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [isPressGallery, setIsPressGallery] = React.useState(false);
    const [email, setEmail] = React.useState('');



    const handleAssociationDataChange = (index: number, data: OutletAssociation) => {
        const newAssociations = [...outletAssociations];
        newAssociations[index] = data; // Update the specific index
        setOutletAssociations(newAssociations);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const hasErrors = handleValidation();
        if (!hasErrors) {
            const contact: MediaContact = new MediaContact()
            contact.firstName = firstName;
            contact.lastName = lastName;
            contact.isPressGallery = isPressGallery;
            contact.email = email;
            contact.jobTitleId = 0;
            //   contact.phoneNumbers = getPersonalPhoneNumbers();
            contact.personalWebsite = website;

            outletAssociations.forEach((_, index) => {
                console.log(`outlet id: ${outletAssociations[index].outletId}`);
                const outletAssociation: OutletAssociation = {
                    id: undefined,
                    contactId: undefined, // This can be set after the contact is created
                    lastRequestDate: undefined,
                    mediaContact: undefined,
                    mediaOutlet: undefined,
                    outletName: outletAssociations[index]?.outletName,
                    outletId: outletAssociations[index].outletId,
                    contactEmail: outletAssociations[index]?.contactEmail,
                    phoneNumber: outletAssociations[index]?.phoneNumber,
                    jobTitle: outletAssociations[index]?.jobTitle,
                    contactPhones: undefined, //outletAssociations[index]?.contactPhones,
                    noLongerWorksHere: outletAssociations[index]?.noLongerWorksHere,
                    isMajorMedia: outletAssociations[index]?.isMajorMedia,
                };
                contact.mediaOutletContactRelationships.push(outletAssociation);
            });

            socialMediaLinks.forEach((link, index) => {
                const socialMedia: SocialMediaLink = {
                    //set all these TBD IDs on server...
                    //  id: undefined,
                    mediaContactId: undefined,
                    mediaOutletId: undefined, // won't set this
                    mediaOutlet: undefined, // won't be set
                    url: link.url,//socialMedias[index]?.socialProfileUrl,
                    companyId: parseInt(link.companyId), //socialMedias[index]?.socialMediaCompanyId,
                    mediaContact: undefined,
                };
                if (socialMedia.url && socialMedia.companyId) {
                    contact.socialMedias.push(socialMedia);
                }
            });
          //  console.log(JSON.stringify(contact));
            const response = await contactService.createContact(contact)
                .then((response) => {

                    console.log(JSON.stringify(response));
                    let outletNames: string = '';
                    outletAssociations.forEach((association) => {
                        outletNames += ` ${association.outletName},`;
                    })
                    const title: string = `${firstName} ${lastName}, ${outletNames} created successfully.`

                    notifySuccess(title, response.id);
                    setFirstName(''); //not sure why this is needed
                    updateList();
                    setIsOpen(false);
                })
                .catch((error) => {
                    notifyFailure(error);
                });
        }
    };

    const handleValidation = (): boolean => {
        setShowValidation(true);
        setError(null);

        const outletErrorsTemp: any[] = []
        const errors: any = {};
        if (!firstName.trim()) errors.firstName = 'A first name is required';
        if (!lastName.trim()) errors.lastName = 'A last name is required';

        // Validate each outlet input
        outletAssociations.forEach((outlet, index) => {
            const currentOutletErrors: any = {};
            if (!outlet.outletName) currentOutletErrors.outlet = 'An outlet must be selected';
            if (!outlet.jobTitle) currentOutletErrors.jobTitle = 'A job title must be selected';
            if (!outlet.contactEmail) currentOutletErrors.email = 'A contact email must be entered'; // ToDo: proper email validation
            if (!outlet.phoneNumber) currentOutletErrors.phone = 'A phone number must be provided'; // ToDo: proper phone number validation

            if (Object.keys(currentOutletErrors).length > 0) outletErrorsTemp[index] = currentOutletErrors; 
        });

        setOutletErrors(outletErrorsTemp);
        console.log(JSON.stringify(outletErrors));
        setFormErrors(errors);
        return Object.keys(errors).length > 0 || outletErrorsTemp.some(error => error !== '');
    }

    const [outlets, setOutlets] = useState<MediaOutlet[]>([]);
    const fetchOutlets = async () => {
        const outlets: MediaOutlet[] = await OutletService.getOutlets();
        setOutlets(outlets);
    };

    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const fetchJobTitles = async () => {
        const jobTitles: JobTitle[] = await contactService.getJobTitles();
        setJobTitles(jobTitles);
    };

    useEffect(() => {
        fetchOutlets();
        fetchJobTitles();
    }, []);

    //notification toast stuff
    const toasterId = useId();
    const { dispatchToast } = useToastController();
    const notifySuccess = (title: string, id: string) => {
        dispatchToast(
            <Toast>
                <ToastTitle>{title}</ToastTitle>
                {/* <ToastBody subtitle="the API responded.">{message}</ToastBody>*/}
                <ToastFooter>
                    <Link href={`/contacts/${id}`} style={{ marginRight: 16 }}>View</Link>
                    <Link href="/contacts/new">Add another</Link>
                </ToastFooter>
            </Toast>,
            { intent: 'success', timeout: 5000, position: 'top-end' }
        );
    }

    const notifyFailure = (response: any) => {
        dispatchToast(
            <Toast>
                <ToastTitle>Something went wrong</ToastTitle>
                <ToastBody subtitle="the API responded.">{response}</ToastBody>
                <ToastFooter>

                </ToastFooter>
            </Toast>,
            { intent: 'error', timeout: 5000, position: 'top-end' }
        );
    }

    return (
        <div>
            <OverlayDrawer
                as="aside"
                {...restoreFocusSourceAttributes}
                open={isOpen}
                onOpenChange={(_, { open }) => setIsOpen(open)}
                className={styles.drawer}
                position="end"
                modalType="alert"
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                aria-label="Close"
                                icon={<Dismiss24Regular />}
                                onClick={() => {
                                    setError(null);
                                    setShowValidation(false);
                                    setOutletInputs([1]);
                                    setIsOpen(false)
                                }}
                            />
                        }
                    >
                        <div className={styles.title}>New contact</div>
                    </DrawerHeaderTitle>
                </DrawerHeader>

                <DrawerBody>
                    <Field label="First name"
                        required
                        validationMessage={showValidation && formErrors.firstName ? "First name is required" : undefined}
                        validationState={showValidation && formErrors.firstName ? "error" : "none"}
                    >
                        <Input
                            value={firstName}
                            onChange={(_, data) => {
                                setFirstName(data.value);
                            }}
                        />
                    </Field>
                    <Field label="Last name"
                        required
                        validationMessage={showValidation && formErrors.lastName ? "Last name is required" : undefined}
                        validationState={showValidation && formErrors.lastName ? "error" : "none"}
                    >
                        <Input
                            onChange={(_, data) => {
                                setLastName(data.value);
                            }}
                        />
                    </Field>
                    <Checkbox
                        checked={isPressGallery}
                        label="Press gallery"
                        onChange={(_, data) => setIsPressGallery(!!data.checked)}
                    />

                    <Divider style={{ margin: '24px 0 16px 0' }} />

                    <Title3 className={styles.sectionHeader}>Workplace information</Title3>
                    {outletInputs.map((outlet, index) => (
                        <MediaOutletInput
                            key={index}
                            onRemove={() => removeOutletInput(index)}
                            onAssociationDataChange={(outlet) => handleAssociationDataChange(index, outlet)}
                            outlets={outlets}
                            jobTitles={jobTitles}
                            showValidation={showValidation}
                            errorMessages={outletErrors[index]}
                        />
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                        <Button appearance="transparent" icon={<Add16Regular />} iconPosition="before" onClick={addOutletInput}>
                            Workplace
                        </Button>
                    </div>

                    <Divider style={{ margin: '24px 0 16px 0' }} />

                    <Title3 className={styles.sectionHeader}>Online presence</Title3>

                    <Field label="Website">
                        <Input placeholder="http://"
                            onChange={(_, data) => setWebsite(data.value)}
                        />
                    </Field>

                    {socialMediaLinks.map((entry, index) => (
                        <Field key={index} label={index === 0 ? "Social media" : ""}>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    flexWrap: 'nowrap',
                                    alignItems: 'center',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                <Dropdown
                                    placeholder=""
                                    appearance="outline"
                                    style={{ flex: '0 0 120px', minWidth: 0, marginBottom: 0 }}
                                    value={entry.typeName}
                                    onOptionSelect={(_, data) => {
                                        const updated = [...socialMediaLinks];
                                        updated[index].typeName = data.optionText || '';
                                        updated[index].companyId = data.optionValue
                                        setSocialMediaLinks(updated);
                                    }}
                                >
                                    {socials.map((social, index) => (
                                        <Option key={index}
                                            value={social.id.toString()}
                                            text={social.company}
                                        >
                                            {social.company}
                                        </Option>
                                    ))}
                                    {/*<Option>LinkedIn</Option>*/}
                                </Dropdown>

                                <Input
                                    placeholder="http://"
                                    appearance="outline"
                                    value={entry.url}
                                    onChange={(_, data) => {
                                        const updated = [...socialMediaLinks];
                                        updated[index].url = data.value;
                                        setSocialMediaLinks(updated);
                                    }}
                                    style={{ flex: '1 1 auto', minWidth: 0 }}
                                />
                            </div>
                        </Field>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            appearance="transparent"
                            icon={<Add24Regular />}
                            onClick={() =>
                                setSocialMediaLinks([...socialMediaLinks, { typeName: '', url: '', companyId: '' }])
                            }
                        >
                            Social media
                        </Button>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            justifyContent: 'flex-start',
                            marginTop: '2rem',
                        }}>
                        <Button
                            aria-label="Create this contact"
                            appearance="primary"
                            onClick={(e) => handleSubmit(e)}
                        >
                            <Body2>Save</Body2>
                        </Button>
                        <Button
                            aria-label="Cancel and close this dialog"
                            onClick={() => {
                                setIsOpen(false)
                                setOutletInputs([1]);
                            }}
                        >
                            <Body2>Cancel</Body2>
                        </Button>
                    </div>

                </DrawerBody>
            </OverlayDrawer>

            <Button
                {...restoreFocusTargetAttributes}
                size="large"
                appearance="primary"
                icon={<Add24Regular />}
                onClick={() => {
                    setError(null);
                    setShowValidation(false);
                    setIsOpen(true)
                }}
            >
                <Body2>Add contact</Body2>
            </Button>
            <Toaster toasterId={toasterId} />
        </div>
    );
};

export default CreateContactDrawer;