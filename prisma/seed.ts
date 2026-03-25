import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.recipe.createMany({
    data: [
      {
        title: 'Klassisches Wiener Schnitzel',
        description: 'Ein traditionelles österreichisches Gericht, das auf der ganzen Welt geliebt wird. Zartes Kalbfleisch mit einer knusprigen Panade.',
        ingredients: JSON.stringify(['4 Kalbsschnitzel', '2 Eier', '100g Mehl', '150g Semmelbrösel', 'Schmalz oder Butterschmalz zum Ausbacken', 'Salz', 'Zitronenspalten zum Servieren']),
        instructions: JSON.stringify([
          'Die Schnitzel zwischen zwei Frischhaltefolien sehr dünn (ca. 4-6 mm) klopfen.',
          'Von beiden Seiten leicht salzen.',
          'Drei tiefe Teller vorbereiten: einen mit Mehl, einen mit den verquirlten Eiern und einen mit den Semmelbröseln.',
          'Jedes Schnitzel zuerst im Mehl wenden (überschüssiges Mehl abklopfen), dann durch die Eier ziehen und zuletzt in den Semmelbröseln wälzen. Die Panade nur leicht andrücken.',
          'In einer großen Pfanne reichlich Schmalz erhitzen. Die Schnitzel schwimmend im heißen Fett bei mittlerer Hitze ca. 3-4 Minuten pro Seite goldbraun ausbacken. Dabei die Pfanne leicht schwenken.',
          'Die Schnitzel herausnehmen und auf Küchenpapier abtropfen lassen.',
          'Mit Zitronenspalten servieren.'
        ]),
        tags: JSON.stringify(['Österreichisch', 'Fleisch', 'Klassiker', 'Hauptspeise']),
        difficulty: 'Mittel',
        cookingTimeMinutes: 30,
        servings: 4,
      },
      {
        title: 'Käsespätzle',
        description: 'Herzhafte Spätzle mit viel Käse und knusprigen Röstzwiebeln. Ein schwäbischer Klassiker.',
        ingredients: JSON.stringify(['400g Mehl', '4 Eier', '1 TL Salz', '150-200ml Wasser', '200g geriebener Emmentaler', '100g geriebener Bergkäse', '3 große Zwiebeln', '2 EL Butter', 'Salz, Pfeffer, Muskatnuss']),
        instructions: JSON.stringify([
          'Mehl, Eier, Salz und Wasser in einer großen Schüssel verrühren und den Teig so lange schlagen, bis er Blasen wirft.',
          'Einen großen Topf mit Salzwasser zum Kochen bringen.',
          'Den Teig portionsweise durch eine Spätzlepresse oder einen Spätzlehobel in das kochende Wasser geben.',
          'Sobald die Spätzle an die Oberfläche steigen, mit einer Schaumkelle herausnehmen und in eine Schüssel geben.',
          'Die Zwiebeln in Ringe schneiden und in einer Pfanne mit etwas Butter goldbraun rösten.',
          'In einer gebutterten Auflaufform abwechselnd eine Schicht Spätzle und eine Schicht der Käsemischung einschichten. Mit einer Käseschicht abschließen.',
          'Bei 200°C Ober-/Unterhitze für ca. 15 Minuten in den Ofen geben, bis der Käse geschmolzen ist.',
          'Mit den Röstzwiebeln garnieren und sofort servieren.'
        ]),
        tags: JSON.stringify(['Schwäbisch', 'Vegetarisch', 'Käse', 'Herzhaft']),
        difficulty: 'Mittel',
        cookingTimeMinutes: 45,
        servings: 4,
      },
      {
        title: 'Kartoffelsalat',
        description: 'Der klassische Kartoffelsalat mit Essig und Öl. Einfach und schnell zubereitet.',
        ingredients: JSON.stringify(['1 kg festkochende Kartoffeln', '1 Zwiebel', '250ml heiße Gemüsebrühe', '4 EL Weißweinessig', '5 EL Öl (Sonnenblumen oder Raps)', '1 TL Senf', 'Salz und Pfeffer', 'Schnittlauch zum Garnieren']),
        instructions: JSON.stringify([
          'Die Kartoffeln mit Schale in kochendem Wasser weich kochen (ca. 20-25 Minuten).',
          'Die Zwiebel fein würfeln.',
          'Die noch warmen Kartoffeln pellen und in dünne Scheiben schneiden.',
          'Die heiße Gemüsebrühe mit Essig, Öl, Senf, Salz und Pfeffer verrühren.',
          'Die Zwiebelwürfel in die Brühe geben und die warme Marinade über die Kartoffelscheiben gießen.',
          'Den Salat vorsichtig mischen und am besten lauwarm ziehen lassen (ca. 30 Minuten).',
          'Vor dem Servieren nochmals abschmecken und mit frischem Schnittlauch garnieren.'
        ]),
        tags: JSON.stringify(['Salat', 'Beilage', 'Vegetarisch', 'Vegan möglich', 'Einfach']),
        difficulty: 'Einfach',
        cookingTimeMinutes: 40,
        servings: 4,
      },
      {
        title: 'Apfelstrudel',
        description: 'Süßer Apfelstrudel mit dünnem Teig und fruchtiger Füllung.',
        ingredients: JSON.stringify(['250g Mehl', '1 Ei', '100ml lauwarmes Wasser', '2 EL Öl', '1 Prise Salz', '1 kg Äpfel', '50g Zucker', '1 TL Zimt', '50g Rosinen', '50g gehackte Walnüsse', '100g flüssige Butter', 'Semmelbrösel']),
        instructions: JSON.stringify([
          'Mehl, Ei, Wasser, Öl und Salz zu einem geschmeidigen Teig verkneten. Zu einer Kugel formen, mit etwas Öl bestreichen und abgedeckt an einem warmen Ort 30 Minuten ruhen lassen.',
          'Die Äpfel schälen, entkernen und in kleine Würfel oder Scheiben schneiden.',
          'Äpfel mit Zucker, Zimt, Rosinen und Walnüssen mischen.',
          'Den Teig auf einem bemehlten Tuch ausrollen und anschließend mit den Handrücken hauchdünn ausziehen (Strudelteig muss so dünn sein, dass man eine Zeitung durchlesen könnte).',
          'Den Teig mit flüssiger Butter bestreichen und mit etwas Semmelbröseln bestreuen.',
          'Die Apfelfüllung auf dem Teig verteilen, dabei einen Rand frei lassen.',
          'Mit Hilfe des Tuchs den Strudel aufrollen und auf ein mit Backpapier belegtes Blech legen.',
          'Mit der restlichen Butter bestreichen.',
          'Bei 190°C (Ober-/Unterhitze) für ca. 45 Minuten backen, bis der Strudel goldbraun ist.'
        ]),
        tags: JSON.stringify(['Dessert', 'Backen', 'Süß', 'Österreichisch']),
        difficulty: 'Schwer',
        cookingTimeMinutes: 90,
        servings: 6,
      },
      {
        title: 'Pfannkuchen',
        description: 'Einfache, dünne Pfannkuchen. Ideal für süße oder herzhafte Füllungen.',
        ingredients: JSON.stringify(['200g Mehl', '4 Eier', '400ml Milch', '1 Prise Salz', 'Öl oder Butter zum Ausbacken']),
        instructions: JSON.stringify([
          'Mehl, Eier, Milch und Salz in einer großen Schüssel zu einem glatten Teig verquirlen. Etwa 15 Minuten quellen lassen.',
          'Eine Pfanne mit etwas Öl oder Butter erhitzen.',
          'Etwa eine Schöpfkelle Teig in die heiße Pfanne geben und durch Schwenken gleichmäßig verteilen.',
          'Den Pfannkuchen von beiden Seiten goldbraun backen (jeweils ca. 1-2 Minuten).',
          'Warm halten oder direkt servieren.',
          'Nach Belieben mit Puderzucker, Nutella, Marmelade oder herzhaften Füllungen servieren.'
        ]),
        tags: JSON.stringify(['Frühstück', 'Dessert', 'Einfach', 'Kinder']),
        difficulty: 'Einfach',
        cookingTimeMinutes: 20,
        servings: 4,
      }
    ]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })