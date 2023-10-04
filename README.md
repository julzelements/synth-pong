# Synth Stage
This project's purpose is simple: to transform the way we learn to use synthesizers. Specifically, the Korg Monologue. This is not just another MIDI controller project. It's a virtual classroom focused on teaching beginners how to make the most of their first real, physical synthesizer.

## Expected Outcomes
* MIDI Connection: Connect the Korg Monologue to the web app successfully to interpret MIDI signals.

* Parameter Display: Develop an intuitive and clear display of the synthesizer's parameters for easy understanding.

* Real-Time Learning: The student can see teachers parameters overlaid upon thier own display and vice versa.

* Patch Management: Implement the ability to create, save, upload, and download patches, fostering a library of sounds for students to explore and learn from.

In essence, this project is about building a "Minority Report" style HUD that enhances the monologue and allows for two way communication.

```mermaid
mindmap
  root((remote synth teaching app))
    sharing patches
    self guided teaching
        learning the parameters
            parameter shows visual explanation when it is adusted
            parameter shows an info box when adjusted
            visualising some of the parameters
        learning patches
            loading a patch and seeing a rainbow diff for each parameter
            lessons that teach how to build different types of sounds param at a time
    visualising patches
    running a lesson
        quick zooom call setup
        quick hangouts setup
        saving the patches from the lesson
    teaching remotely
        real time midi
            display
                teacher seeing student synth
                student seeing teacher synth
            control
                teacher controlling student synth
                student controlling teacher synth

```