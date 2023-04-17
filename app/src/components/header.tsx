import { useState } from 'react';
import { Navbar, Center, Tooltip, UnstyledButton, createStyles, Stack, rem } from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconUser,
    IconSettings,
    IconLogout,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
// import { MantineLogo } from '@mantine/ds';
import React from 'react';
import { Navigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
    link: {
        width: rem(50),
        height: rem(50),
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.white,
        opacity: 0.85,

        '&:hover': {
            opacity: 1,
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
                0.1
            ),
        },
    },

    active: {
        opacity: 1,
        '&, &:hover': {
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
                0.15
            ),
        },
    },
}));

interface NavbarLinkProps {
    icon: React.FC<any>;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    const { classes, cx } = useStyles();
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
                <Icon size="1.2rem" stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconHome2, label: 'Home', value: "" },
    { icon: IconGauge, label: 'Dashboard', value: "election" },
    { icon: IconUser, label: 'Account', value: "ballot" },
    { icon: IconSettings, label: 'Settings', value: "actual" },
    { icon: IconSettings, label: 'Candidates', value: "candidates" },
];

export function NavbarMinimal() {
    const [active, setActive] = useState(2);


    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <Navbar
            height={750}
            width={{ base: 80 }}
            p="md"
            sx={(theme) => ({
                backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
                    .background,
            })}
        >
            <Center>
                {/* <MantineLogo type="mark" inverted size={30} /> */}
            </Center>
            <Navbar.Section grow mt={50}>
                <Stack justify="center" spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    {/* <NavbarLink icon={IconSwitchHorizontal} label="Change account" /> */}
                    <NavbarLink icon={IconLogout} label="Logout" />
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
}

export default NavbarMinimal;