const texts = [
  "“Be brave to stand for what you believe in even if you stand alone.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“Always find opportunities to make someone smile, and to offer random acts of kindness in everyday life.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“Do you want to know who you are? Don't ask. Act! Action will delineate and define you.”\n" +
    "― Thomas Jefferson",
  "“What you do makes a difference, and you have to decide what kind of difference you want to make.”\n" +
    "― Jane Goodall",
  "“You yourself, as much as anybody in the entire universe, deserve your love and affection.”\n" +
    "― Sharon Salzberg",
  "“Love is the absence of judgment.”\n― Dalai Lama XIV",
  "“Time doesn’t heal emotional pain, you need to learn how to let go.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“Cry. Forgive. Learn. Move on. Let your tears water the seeds of your future happiness.”\n" +
    "― Steve Maraboli",
  "“To shine your brightest light is to be who you truly are.”\n" +
    "― Roy T. Bennett",
  "“Be thankful for everything that happens in your life; it’s all an experience.”\n" +
    "― Roy T. Bennett",
  "“The reason it hurts so much to separate is because our souls are connected. Maybe they always have been and will be. Maybe we've lived a thousand lives before this one and in each of them we've found each other. And maybe each time, we've been forced apart for the same reasons. That means that this goodbye is both a goodbye for the past ten thousand years and a prelude to what will come.”\n" +
    "― Nicholas Sparks, The Notebook",
  "“Sometimes you have to lose all you have to find out who you truly are.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“I read once that the ancient Egyptians had fifty words for sand & the Eskimos had a hundred words for snow. I wish I had a thousand words for love, but all that comes to mind is the way you move against me while you sleep & there are no words for that.”\n" +
    "― Brian Andreas, Story People",
  "“You never change your life until you step out of your comfort zone; change begins at the end of your comfort zone.”\n" +
    "― Roy T. Bennett",
  "“Do not let the memories of your past limit the potential of your future. There are no limits to what you can achieve on your journey through life, except in your mind.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“Stop comparing yourself to other people, just choose to be happy and live your own life.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“You are not rich until you have a rich heart.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“Let the improvement of yourself keep you so busy that you have no time to criticize others.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“If everybody is thinking alike, then somebody isn't thinking.”\n" +
    "― George S. Patton",
  "“Ignore those that make you fearful and sad, that degrade you back towards disease and death.”\n" +
    "― Rumi Jalalud-Din",
  "“For me, I am driven by two main philosophies: know more today about the world than I knew yesterday and lessen the suffering of others. You'd be surprised how far that gets you.”\n" +
    "― Neil deGrasse Tyson",
  "“You can't wait for inspiration. You have to go after it with a club.”\n" +
    "― Jack London",
  "“Do not set aside your happiness. Do not wait to be happy in the future. The best time to be happy is always now.”\n" +
    "― Roy T. Bennett",
  "“Believe in your infinite potential. Your only limitations are those you set upon yourself.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“To give pleasure to a single heart by a single act is better than a thousand heads bowing in prayer.”\n" +
    "― Mahatma Gandhi",
  "“The soul is healed by being with children.”\n― Fyodor Dostoevsky",
  "“Listen with curiosity. Speak with honesty. Act with integrity. The greatest problem with communication is we don’t listen to understand. We listen to reply. When we listen with curiosity, we don’t listen with the intent to reply. We listen for what’s behind the words.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“Help others without any reason and give without the expectation of receiving anything in return.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
  "“It was only a sunny smile, and little it cost in the giving, but like morning light it scattered the night and made the day worth living.”\n" +
    "― F. Scott Fitzgerald",
  "“It’s your life; you don’t need someone’s permission to live the life you want. Be brave to live from your heart.”\n" +
    "― Roy T. Bennett, The Light in the Heart",
];

console.log(
  texts.map((t) => {
    const textWithoutQuotes = t.replace(/[”“]/g, "");
    const ex = textWithoutQuotes.split("― ");
    const q = {
      quote: ex[0],
      author: ex[1],
    };

    console.log(q);

    return q;
  })
);
