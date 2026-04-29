"use client";

import { CallIcon, Chat01Icon, Location01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactItems = [
  {
    title: "Chat with us",
    description: "Hubungi kami melalui chat untuk respon cepat.",
    icon: Chat01Icon,
  },
  {
    title: "Call us",
    description: "+62 (851) 2345-5678",
    icon: CallIcon,
  },
  {
    title: "Visit us",
    description: "Jakarta, Indonesia",
    icon: Location01Icon,
  },
];

export default function Contact() {
  return (
    <main className="bg-background">
      <section className="mx-auto grid min-h-[calc(100svh-3.5rem)] max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[0.9fr_1fr] lg:gap-20 lg:py-24">
        <div className="flex flex-col justify-center gap-8">
          <div className="flex flex-col gap-5">
            <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-normal md:text-5xl">Kami siap membantu Anda</h1>
            <p className="max-w-md text-base leading-7 text-muted-foreground md:text-lg">Punya pertanyaan atau butuh bantuan terkait Payoy? Tim kami siap membantu Anda.</p>
          </div>

          <div className="flex flex-col gap-5">
            {contactItems.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-lg border bg-card text-primary">
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={(event) => event.preventDefault()} className="flex items-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">Kirim pesan</CardTitle>
            </CardHeader>

            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="contact-name">Nama</FieldLabel>
                  <Input id="contact-name" placeholder="Icha" required />
                </Field>

                <FieldGroup className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                    <Input id="contact-email" type="email" placeholder="example@gmail.com" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="contact-phone">Phone</FieldLabel>
                    <Input id="contact-phone" type="tel" placeholder="+62 851 2345 6789" required />
                  </Field>
                </FieldGroup>

                <Field>
                  <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
                  <Input id="contact-subject" placeholder="Topik yang ingin Anda bahas" required />
                </Field>

                <Field>
                  <FieldLabel htmlFor="contact-message">Pesan</FieldLabel>
                  <Textarea id="contact-message" placeholder="Tulis pesan kamu di sini" className="min-h-28 resize-none" required />
                </Field>
              </FieldGroup>
            </CardContent>

            <CardFooter>
              <Button type="submit">
                <HugeiconsIcon icon={SentIcon} strokeWidth={2} data-icon="inline-start" />
                Kirim
              </Button>
            </CardFooter>
          </Card>
        </form>
      </section>
    </main>
  );
}
