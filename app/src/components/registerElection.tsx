import React, { Component, useEffect, useState } from "react";
import { createStyles, rem, Select, Button, TextInput } from '@mantine/core';
// import { DatePickerInput } from '@mantine/dates';

import "../styles/login.css";

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
  },

  input: {
    height: rem(54),
    paddingTop: rem(18),
  },

  label: {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: `calc(${theme.spacing.sm} / 2)`,
    zIndex: 1,
  },
})
);

export default function ElectionCreation({ }) {
  const { classes } = useStyles();

  return (
    <div>
      <TextInput label="Názov volieb" placeholder="Parlamentné voľby SR" max={50} classNames={classes} />

      <TextInput label="Popis" placeholder="Parlamentné voľby Slovenskej Republiky" max={50} classNames={classes} />

      <Button color="green" radius="lg" size="md">
        Settings
      </Button>

      {/* <Select
        mt="md"
        withinPortal
        data={['React', 'Angular', 'Svelte', 'Vue']}
        placeholder="Pick one"
        label="Your favorite library/framework"
        classNames={classes}
      />

      <DatePickerInput
        mt="md"
        popoverProps={{ withinPortal: true }}
        label="Departure date"
        placeholder="When will you leave?"
        classNames={classes}
        clearable={false}
      /> */}
    </div>
  );
}
